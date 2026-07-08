import type { PublicOrder } from '@/lib/types.ts'
import { formatDate } from '@/lib/format.ts'

/** Milestones of the happy path, in order. */
export const ROUTE_STEPS = [
  'Received',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Delivered',
] as const

export interface StatusView {
  headline: string
  detail: string
  /** Index into ROUTE_STEPS of the milestone currently reached; null for terminal states. */
  activeStep: number | null
  /** Whole route complete (delivered) — render every step as done. */
  done: boolean
  /** Only some items have shipped — mark the Shipped step as partial. */
  partial: boolean
  terminal: 'cancelled' | 'refunded' | null
}

function progress(
  headline: string,
  detail: string,
  activeStep: number,
  extras?: Partial<StatusView>,
): StatusView {
  return {
    headline,
    detail,
    activeStep,
    done: false,
    partial: false,
    terminal: null,
    ...extras,
  }
}

export function statusView(order: PublicOrder): StatusView {
  const placed = `Placed ${formatDate(order.createdAt)}.`
  switch (order.status) {
    case 'pending':
      return progress('Order received', `${placed} We’ll confirm it shortly.`, 0)
    case 'confirmed':
      return progress(
        'Order confirmed',
        `${placed} It’s queued for preparation.`,
        1,
      )
    case 'processing':
      return progress(
        'Being prepared',
        `${placed} We’re picking and packing your items.`,
        2,
      )
    case 'partially_shipped':
      return progress(
        'Partially shipped',
        'Some items are on their way — the rest will follow shortly.',
        3,
        { partial: true },
      )
    case 'shipped':
      return progress(
        'On its way',
        'Your package has left us and is heading to you.',
        3,
      )
    case 'delivered':
      return progress(
        'Delivered',
        order.deliveredAt
          ? `Delivered ${formatDate(order.deliveredAt)}.`
          : 'Your order has been delivered.',
        4,
        { done: true },
      )
    case 'cancelled':
      return {
        headline: 'Order cancelled',
        detail: `${placed} This order won’t be delivered.`,
        activeStep: null,
        done: false,
        partial: false,
        terminal: 'cancelled',
      }
    case 'refunded':
      return {
        headline: 'Order refunded',
        detail: `${placed} This order has been refunded.`,
        activeStep: null,
        done: false,
        partial: false,
        terminal: 'refunded',
      }
  }
}
