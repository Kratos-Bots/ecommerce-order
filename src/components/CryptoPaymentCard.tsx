import { useState } from 'react'
import { Check, Copy, Hourglass, CircleCheck, TriangleAlert } from 'lucide-react'
import QRCode from 'react-qr-code'
import { submitCryptoTxid } from '@/lib/api.ts'
import type { PublicCryptoPayment } from '@/lib/types.ts'

interface Props {
  orderRef: string
  accessKey: string
  payment: PublicCryptoPayment
  onSubmitted: () => void
}

export function CryptoPaymentCard({ orderRef, accessKey, payment, onSubmitted }: Props) {
  const [copied, setCopied] = useState(false)
  const [txid, setTxid] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(payment.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing to do.
    }
  }

  async function submit() {
    if (!txid.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await submitCryptoTxid(orderRef, accessKey, payment.paymentId, txid.trim())
      setTxid('')
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const status = payment.verificationStatus
  const paymentStatus = payment.paymentStatus

  return (
    <section className=" border border-line bg-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        Pay with {payment.coinLabel} · {payment.networkLabel}
      </p>

      {paymentStatus === 'completed' ? (
        <p className="mt-3 flex items-center gap-2 bg-bay-soft p-3 text-sm text-bay-deep">
          <CircleCheck className="size-4 shrink-0" aria-hidden /> Payment confirmed — thank you.
        </p>
      ) : paymentStatus === 'failed' || paymentStatus === 'refunded' ? (
        <p className="mt-3 bg-clay/10 p-3 text-sm text-ink-soft">This payment is no longer active.</p>
      ) : status === 'confirmed' ? (
        <p className="mt-3 flex items-center gap-2 bg-bay-soft p-3 text-sm text-bay-deep">
          <CircleCheck className="size-4 shrink-0" aria-hidden /> Payment confirmed — thank you.
        </p>
      ) : status === 'checking' ? (
        <p className="mt-3 flex items-center gap-2 bg-hay-soft p-3 text-sm text-hay" aria-live="polite">
          <Hourglass className="size-4 shrink-0" aria-hidden />
          Transaction {payment.txidMasked} received — waiting for network confirmations.
        </p>
      ) : (
        <>
          {status === 'needs_review' && (
            <p className="mt-3 flex items-center gap-2 bg-hay-soft p-3 text-sm text-hay">
              <TriangleAlert className="size-4 shrink-0" aria-hidden />
              We could not verify {payment.txidMasked} automatically — our team will review it. You
              can submit a corrected transaction ID below.
            </p>
          )}
          <p className="mt-3 text-sm text-ink-soft">
            Send exactly{' '}
            <span className="font-mono font-medium text-ink tabular-nums">
              {payment.coinAmount} {payment.coinLabel}
            </span>{' '}
            on the <span className="font-medium text-ink">{payment.networkLabel}</span> network to:
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink">
              {payment.address}
            </span>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy address"
              className="flex size-11 shrink-0 items-center justify-center border border-line text-ink-soft transition active:scale-[0.99]"
            >
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            </button>
          </div>
          <div className="mt-3 flex justify-center bg-white p-3">
            <QRCode value={payment.address} size={144} aria-label={`QR code for ${payment.coinLabel} address`} />
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Only send {payment.coinLabel} on {payment.networkLabel}. Other coins or networks will be
            lost.
          </p>
          <label
            className="mt-4 block font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft"
            htmlFor={`txid-${payment.paymentId}`}
          >
            Transaction ID
          </label>
          <input
            id={`txid-${payment.paymentId}`}
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            placeholder="Paste your txid after sending"
            className="mt-1 w-full border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-bay"
          />
          {error && (
            <p className="mt-2 text-sm text-clay" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!txid.trim() || submitting}
            className="mt-3 min-h-12 w-full bg-bay font-medium text-white transition active:scale-[0.99] disabled:opacity-50"
          >
            {submitting ? 'Checking…' : "I've sent it — verify"}
          </button>
        </>
      )}
    </section>
  )
}
