import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import OrderPage from '@/pages/OrderPage.tsx'
import InvalidLinkPage from '@/pages/InvalidLinkPage.tsx'
import '@/index.css'

const router = createBrowserRouter([
  { path: '/:orderRef/:accessKey', element: <OrderPage /> },
  { path: '*', element: <InvalidLinkPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
