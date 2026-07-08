export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'partially_shipped'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type ShipmentStatus = 'shipped' | 'in_transit' | 'delivered' | 'returned'

export interface OrderItem {
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  isPreorder: boolean
}

export interface OrderTotals {
  subtotal: number
  shippingAmount: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
}

export interface ShippingAddress {
  firstName: string
  surname: string
  addressLine1: string
  addressLine2: string | null
  addressLine3: string | null
  city: string
  county: string | null
  zip: string
  country: string
}

export interface Shipment {
  status: ShipmentStatus
  carrier: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  trackingStatusDescription: string | null
  shippedAt: string | null
  deliveredAt: string | null
}

export interface PublicOrder {
  reference: string
  status: OrderStatus
  createdAt: string
  deliveredAt: string | null
  isPreorder: boolean
  currency: string
  items: OrderItem[]
  totals: OrderTotals
  shippingAddress: ShippingAddress | null
  shipments: Shipment[]
}
