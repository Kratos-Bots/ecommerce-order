import type { ShippingAddress } from '@/lib/types.ts'

export function AddressCard({ address }: { address: ShippingAddress }) {
  const lines = [
    address.addressLine1,
    address.addressLine2,
    address.addressLine3,
    [address.city, address.county].filter(Boolean).join(', '),
    address.zip,
    address.country,
  ].filter((line): line is string => Boolean(line))

  return (
    <section className=" border border-line bg-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        Delivery address
      </p>
      <address className="mt-3 text-[15px] leading-relaxed not-italic">
        <p className="font-medium">
          {address.firstName} {address.surname}
        </p>
        {lines.map((line, i) => (
          <p key={i} className="text-ink-soft">
            {line}
          </p>
        ))}
      </address>
    </section>
  )
}
