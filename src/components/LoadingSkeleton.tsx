import { SiteHeader } from '@/components/SiteHeader.tsx'

export function LoadingSkeleton() {
  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader />
      <main
        className="mx-auto w-full max-w-md px-5 pt-8"
        aria-busy="true"
        aria-label="Loading your order"
      >
        <div className="animate-pulse space-y-3 motion-reduce:animate-none">
          <div className="h-3 w-24 rounded bg-ink/10" />
          <div className="h-9 w-52 rounded-lg bg-ink/10" />
          <div className="h-4 w-64 rounded bg-ink/10" />
          <div className="space-y-5 pt-6 pb-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="size-6 rounded-full bg-ink/10" />
                <div className="h-4 w-28 rounded bg-ink/10" />
              </div>
            ))}
          </div>
          <div className="h-48 rounded-2xl bg-ink/10" />
          <div className="h-64 rounded-2xl bg-ink/10" />
        </div>
      </main>
    </div>
  )
}
