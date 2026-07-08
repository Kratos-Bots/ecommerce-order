import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import type { Shipment, ShipmentStatus } from '@/lib/types.ts'
import { formatDate } from '@/lib/format.ts'

const STATUS_LABEL: Record<ShipmentStatus, string> = {
  shipped: 'Shipped',
  in_transit: 'In transit',
  delivered: 'Delivered',
  returned: 'Returned',
}

const STATUS_PILL: Record<ShipmentStatus, string> = {
  shipped: 'bg-bay-soft text-bay-deep',
  in_transit: 'bg-bay-soft text-bay-deep',
  delivered: 'bg-bay text-white',
  returned: 'bg-clay-soft text-clay',
}

export function ShipmentCard({
  shipment,
  index,
  count,
}: {
  shipment: Shipment
  index: number
  count: number
}) {
  const [copied, setCopied] = useState(false)

  async function copyTrackingNumber() {
    if (!shipment.trackingNumber) return
    try {
      await navigator.clipboard.writeText(shipment.trackingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing to do.
    }
  }

  return (
    <section className=" border border-line bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            {count > 1 ? `Shipment ${index + 1} of ${count}` : 'Shipment'}
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            {shipment.carrier ?? 'Courier'}
          </h2>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 text-xs font-medium ${STATUS_PILL[shipment.status]}`}
        >
          {STATUS_LABEL[shipment.status]}
        </span>
      </div>

      {shipment.trackingStatusDescription && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {shipment.trackingStatusDescription}
        </p>
      )}

      {shipment.trackingNumber && (
        <div className="mt-4 flex items-center justify-between gap-2 border border-line bg-paper py-1 pr-1 pl-3.5">
          <span className="truncate font-mono text-sm">
            {shipment.trackingNumber}
          </span>
          <button
            type="button"
            onClick={copyTrackingNumber}
            aria-label={
              copied ? 'Tracking number copied' : 'Copy tracking number'
            }
            className="flex size-11 shrink-0 items-center justify-center text-ink-soft transition hover:text-ink active:scale-95"
          >
            {copied ? (
              <Check size={17} className="text-bay" aria-hidden />
            ) : (
              <Copy size={17} aria-hidden />
            )}
          </button>
        </div>
      )}

      {shipment.trackingUrl && (
        <a
          href={shipment.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-12 items-center justify-center gap-1.5 bg-bay text-[15px] font-medium text-white transition active:scale-[0.99]"
        >
          Track package
          <ArrowUpRight size={17} aria-hidden />
        </a>
      )}

      {(shipment.shippedAt || shipment.deliveredAt) && (
        <p className="mt-3 text-xs text-ink-soft">
          {shipment.shippedAt && `Shipped ${formatDate(shipment.shippedAt)}`}
          {shipment.shippedAt && shipment.deliveredAt && ' · '}
          {shipment.deliveredAt && `Delivered ${formatDate(shipment.deliveredAt)}`}
        </p>
      )}
    </section>
  )
}
