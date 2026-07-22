import type { PublicOrder } from '@/lib/types.ts'
import { demoOrder, isDemoRef, demoCryptoTxid } from '@/lib/demo-fixture.ts'

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

/** The link is unknown or no longer valid — show the invalid-link screen. */
export class InvalidLinkError extends Error {
  constructor() {
    super('Invalid order link')
    this.name = 'InvalidLinkError'
  }
}

interface Envelope {
  success: boolean
  data?: PublicOrder
  error?: { message: string }
}

export async function fetchPublicOrder(
  orderRef: string,
  accessKey: string,
): Promise<PublicOrder> {
  // Dev-only design preview; see src/lib/demo-fixture.ts. Stripped in prod builds.
  if (import.meta.env.DEV && isDemoRef(orderRef)) {
    return demoOrder(accessKey)
  }

  let res: Response
  try {
    res = await fetch(
      `${API_BASE_URL}/public/orders/${encodeURIComponent(orderRef)}/${encodeURIComponent(accessKey)}`,
      { headers: { Accept: 'application/json' } },
    )
  } catch {
    throw new Error('Network request failed')
  }

  if (res.status === 404) throw new InvalidLinkError()
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)

  let body: Envelope
  try {
    body = (await res.json()) as Envelope
  } catch {
    throw new Error('Malformed response')
  }

  if (!body.success || !body.data) throw new InvalidLinkError()
  return body.data
}

interface CryptoTxidEnvelope {
  success: boolean
  data?: { verificationStatus: string }
  error?: string | { message?: string }
}

export async function submitCryptoTxid(
  orderRef: string,
  accessKey: string,
  paymentId: number,
  txid: string,
): Promise<{ verificationStatus: string }> {
  // Dev-only design preview; see src/lib/demo-fixture.ts. Stripped in prod builds.
  if (import.meta.env.DEV && isDemoRef(orderRef)) {
    return demoCryptoTxid()
  }

  const res = await fetch(
    `${API_BASE_URL}/public/orders/${encodeURIComponent(orderRef)}/${encodeURIComponent(accessKey)}/crypto-txid`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ paymentId, txid }),
    },
  )
  const body = (await res.json().catch(() => null)) as CryptoTxidEnvelope | null
  if (!res.ok || !body?.success || !body.data) {
    const message = typeof body?.error === 'string' ? body.error : body?.error?.message
    throw new Error(message ?? 'Could not submit the transaction ID — please try again')
  }
  return body.data
}
