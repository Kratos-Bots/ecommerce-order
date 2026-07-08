import type { ReactNode } from 'react'
import { CloudOff, PackageX, RotateCw } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader.tsx'

function NoticeScreen({
  icon,
  headline,
  body,
  action,
}: {
  icon: ReactNode
  headline: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <span className="flex size-14 items-center justify-center border border-line bg-card text-ink-soft">
          {icon}
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
          {headline}
        </h1>
        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-soft">
          {body}
        </p>
        {action && <div className="mt-7">{action}</div>}
      </main>
    </div>
  )
}

export function InvalidLinkScreen() {
  return (
    <NoticeScreen
      icon={<PackageX size={24} aria-hidden />}
      headline="This link isn’t valid"
      body="Check the link you were sent, or contact us and we’ll help you find your order."
    />
  )
}

export function NetworkErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <NoticeScreen
      icon={<CloudOff size={24} aria-hidden />}
      headline="We couldn’t load your order"
      body="Check your connection and try again."
      action={
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-12 items-center gap-2 bg-bay px-7 text-[15px] font-medium text-white transition active:scale-[0.98]"
        >
          <RotateCw size={16} aria-hidden />
          Try again
        </button>
      }
    />
  )
}
