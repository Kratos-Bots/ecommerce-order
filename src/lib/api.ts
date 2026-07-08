import type { PublicOrder } from '@/lib/types.ts'
import { demoOrder, isDemoRef } from '@/lib/demo-fixture.ts'

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
