import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { fetchPublicOrder, InvalidLinkError } from '@/lib/api.ts'
import type { PublicOrder } from '@/lib/types.ts'
import { SiteHeader } from '@/components/SiteHeader.tsx'
import { SiteFooter } from '@/components/SiteFooter.tsx'
import { StatusHero } from '@/components/StatusHero.tsx'
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

  useEffect(() => {
    if (!orderRef || !accessKey) {
      setState({ phase: 'invalid' })
      return
    }
    let stale = false
    setState({ phase: 'loading' })
    fetchPublicOrder(orderRef, accessKey)
      .then((order) => {
        if (!stale) setState({ phase: 'ready', order })
      })
      .catch((error: unknown) => {
        if (stale) return
        setState({
          phase: error instanceof InvalidLinkError ? 'invalid' : 'error',
        })
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
