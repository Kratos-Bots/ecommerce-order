// ---------------------------------------------------------------------------
// DEV-ONLY mock. `fetchPublicOrder()` serves this fixture when
// `import.meta.env.DEV` is true and the order reference is DEMO01, so the page
// can be designed and reviewed without a running backend. It is never reached
// in production builds.
//
// The access-key segment may name an order status to preview that state, e.g.
//   /DEMO01/delivered   /DEMO01/processing   /DEMO01/cancelled
// Any other access key renders the default "shipped" state.
// ---------------------------------------------------------------------------
import type { OrderStatus, PublicCryptoPayment, PublicOrder, Shipment } from '@/lib/types.ts'

const DEMO_REF = 'DEMO01'

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'partially_shipped',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

export function isDemoRef(orderRef: string): boolean {
  return orderRef === DEMO_REF
}

const demoCryptoPayment: PublicCryptoPayment = {
  paymentId: 1,
  coin: 'USDT',
  network: 'polygon',
  coinLabel: 'USDT',
  networkLabel: 'Polygon',
  address: '0x4b3F1a2E9c7D6b8A5f0C2d1E3b4A5c6D7e8F9012',
  coinAmount: '43.61',
  fiatAmount: 43.44,
  verificationStatus: 'checking',
  needsAttention: false,
  txidMasked: '0x9a3c…7f21',
}

/** Dev-only mock for submitCryptoTxid(); see fetchPublicOrder() above. */
export async function demoCryptoTxid(): Promise<{ verificationStatus: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return { verificationStatus: 'checking' }
}

export async function demoOrder(accessKey: string): Promise<PublicOrder> {
  // Simulate network latency so the loading skeleton is visible.
  await new Promise((resolve) => setTimeout(resolve, 700))

  const status: OrderStatus = ORDER_STATUSES.includes(accessKey as OrderStatus)
    ? (accessKey as OrderStatus)
    : 'shipped'

  const baseShipment: Shipment = {
    status: 'in_transit',
    carrier: 'Royal Mail',
    trackingNumber: 'RM204519873GB',
    trackingUrl: 'https://www.royalmail.com/track-your-item#/tracking-results/RM204519873GB',
    trackingStatusDescription:
      'Arrived at your local delivery office — out for delivery soon.',
    shippedAt: '2026-07-05T09:12:00Z',
    deliveredAt: null,
  }

  let shipments: Shipment[] = []
  let deliveredAt: string | null = null

  if (status === 'shipped' || status === 'partially_shipped') {
    shipments = [baseShipment]
  } else if (status === 'delivered') {
    deliveredAt = '2026-07-07T13:41:00Z'
    shipments = [
      {
        ...baseShipment,
        status: 'delivered',
        trackingStatusDescription: 'Delivered and signed for.',
        deliveredAt,
      },
    ]
  }

  return {
    reference: DEMO_REF,
    status,
    createdAt: '2026-07-01T10:24:00Z',
    deliveredAt,
    isPreorder: true,
    currency: 'GBP',
    items: [
      {
        productName: 'Vitamin D3 4000 IU — 120 softgels',
        quantity: 2,
        unitPrice: 8.5,
        totalPrice: 17,
        isPreorder: false,
      },
      {
        productName: 'Omega-3 Fish Oil 1000 mg — 90 capsules',
        quantity: 1,
        unitPrice: 12.99,
        totalPrice: 12.99,
        isPreorder: false,
      },
      {
        productName: 'Electrolyte Hydration Sachets — box of 20',
        quantity: 1,
        unitPrice: 14.5,
        totalPrice: 14.5,
        isPreorder: true,
      },
    ],
    totals: {
      subtotal: 44.49,
      shippingAmount: 3.95,
      discountAmount: 5,
      taxAmount: 0,
      totalAmount: 43.44,
    },
    shippingAddress: {
      firstName: 'Amelia',
      surname: 'Clarke',
      addressLine1: 'Flat 3, 14 Harbourside Walk',
      addressLine2: 'Wapping Wharf',
      addressLine3: null,
      city: 'Bristol',
      county: null,
      zip: 'BS1 5DB',
      country: 'United Kingdom',
    },
    shipments,
    cryptoPayments: [demoCryptoPayment],
  }
}
