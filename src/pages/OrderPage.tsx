import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { fetchPublicOrder, InvalidLinkError } from '@/lib/api.ts'
import type { PublicOrder } from '@/lib/types.ts'
import { SiteHeader } from '@/components/SiteHeader.tsx'
import { SiteFooter } from '@/components/SiteFooter.tsx'
import { StatusHero } from '@/components/StatusHero.tsx'
import { CryptoPaymentCard } from '@/components/CryptoPaymentCard.tsx'
import { ShipmentCard } from '@/components/ShipmentCard.tsx'
import { ItemsCard } from '@/components/ItemsCard.tsx'
import { AddressCard } from '@/components/AddressCard.tsx'
import { LoadingSkeleton } from '@/components/LoadingSkeleton.tsx'
import {
  InvalidLinkScreen,
  NetworkErrorScreen,
} from '@/components/NoticeScreen.tsx'

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready'; order: PublicOrder }
  | { phase: 'invalid' }
  | { phase: 'error' }

export default function OrderPage() {
  const { orderRef, accessKey } = useParams()
  const [state, setState] = useState<LoadState>({ phase: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const lastParamsRef = useRef<string | null>(null)

  useEffect(() => {
    if (!orderRef || !accessKey) {
      setState({ phase: 'invalid' })
      return
    }
    // Param changes are a hard reset (new order); attempt bumps from the
    // crypto poll / post-submit refresh are soft — keep a ready page
    // mounted so in-progress card inputs aren't destroyed.
    const paramsKey = `${orderRef}/${accessKey}`
    const isNewParams = lastParamsRef.current !== paramsKey
    const isSoftRefresh = !isNewParams && state.phase === 'ready'
    if (isNewParams) {
      lastParamsRef.current = paramsKey
      setState({ phase: 'loading' })
    } else {
      setState((prev) => (prev.phase === 'ready' ? prev : { phase: 'loading' }))
    }
    let stale = false
    fetchPublicOrder(orderRef, accessKey)
      .then((order) => {
        if (!stale) setState({ phase: 'ready', order })
      })
      .catch((error: unknown) => {
        if (stale) return
        if (error instanceof InvalidLinkError) {
          setState({ phase: 'invalid' })
          return
        }
        // Background refresh failed: keep stale ready data on screen
        // rather than blowing the page away; the next poll retries.
        if (isSoftRefresh) return
        setState({ phase: 'error' })
      })
    return () => {
      stale = true
    }
  }, [orderRef, accessKey, attempt])

  useEffect(() => {
    document.title =
      state.phase === 'ready'
        ? `Order ${state.order.reference} — status`
        : 'Order status'
  }, [state])

  useEffect(() => {
    if (state.phase !== 'ready') return
    const isChecking = state.order.cryptoPayments?.some(
      (cp) => cp.verificationStatus === 'checking',
    )
    if (!isChecking) return
    let stale = false
    const timer = setTimeout(() => {
      if (!stale) setAttempt((a) => a + 1)
    }, 30_000)
    return () => {
      stale = true
      clearTimeout(timer)
    }
  }, [state, orderRef, accessKey])

  if (state.phase === 'loading') return <LoadingSkeleton />
  if (state.phase === 'invalid') return <InvalidLinkScreen />
  if (state.phase === 'error')
    return <NetworkErrorScreen onRetry={() => setAttempt((a) => a + 1)} />

  const { order } = state
  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader reference={order.reference} />
      <main className="mx-auto w-full max-w-md">
        <StatusHero order={order} />
        <div className="space-y-3 px-5 pt-8">
          {order.cryptoPayments?.map((cp) => (
            <CryptoPaymentCard
              key={cp.paymentId}
              orderRef={orderRef!}
              accessKey={accessKey!}
              payment={cp}
              onSubmitted={() => setAttempt((a) => a + 1)}
            />
          ))}
          {order.shipments.map((shipment, i) => (
            <ShipmentCard
              key={i}
              shipment={shipment}
              index={i}
              count={order.shipments.length}
            />
          ))}
          <ItemsCard
            items={order.items}
            totals={order.totals}
            currency={order.currency}
          />
          {order.shippingAddress && (
            <AddressCard address={order.shippingAddress} />
          )}
        </div>
        <SiteFooter reference={order.reference} />
      </main>
    </div>
  )
}
