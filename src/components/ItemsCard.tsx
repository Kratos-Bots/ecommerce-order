import type { OrderItem, OrderTotals } from '@/lib/types.ts'
import { formatMoney } from '@/lib/format.ts'

export function ItemsCard({
  items,
  totals,
  currency,
}: {
  items: OrderItem[]
  totals: OrderTotals
  currency: string
}) {
  return (
    <section className=" border border-line bg-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        Items
      </p>

      <ul className="mt-2 divide-y divide-line">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-baseline justify-between gap-4 py-3.5 last:pb-5"
          >
            <div className="min-w-0">
              <p className="text-[15px] leading-snug font-medium">
                {item.productName}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {item.quantity} × {formatMoney(item.unitPrice, currency)}
                {item.isPreorder && (
                  <span className="ml-2 bg-hay-soft px-2 py-0.5 text-[11px] font-medium text-hay">
                    Pre-order
                  </span>
                )}
              </p>
            </div>
            <p className="shrink-0 text-[15px] font-medium tabular-nums">
              {formatMoney(item.totalPrice, currency)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(totals.subtotal, currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Delivery</dt>
          <dd className="tabular-nums">
            {totals.shippingAmount === 0
              ? 'Free'
              : formatMoney(totals.shippingAmount, currency)}
          </dd>
        </div>
        {totals.discountAmount > 0 && (
          <div className="flex justify-between">
            <dt className="text-ink-soft">Discount</dt>
            <dd className="tabular-nums text-bay">
              −{formatMoney(totals.discountAmount, currency)}
            </dd>
          </div>
        )}
        {totals.taxAmount > 0 && (
          <div className="flex justify-between">
            <dt className="text-ink-soft">Tax</dt>
            <dd className="tabular-nums">{formatMoney(totals.taxAmount, currency)}</dd>
          </div>
        )}
        <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(totals.totalAmount, currency)}</dd>
        </div>
      </dl>
    </section>
  )
}
