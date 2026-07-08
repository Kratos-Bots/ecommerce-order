import { Ban, Check, Clock, Undo2 } from 'lucide-react'
import type { PublicOrder } from '@/lib/types.ts'
import { ROUTE_STEPS, statusView } from '@/lib/status.ts'

export function StatusHero({ order }: { order: PublicOrder }) {
  const view = statusView(order)
  return (
    <section className="px-5 pt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        Order status
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-balance">
        {view.headline}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        {view.detail}
      </p>
      {order.isPreorder && !view.terminal && !view.done && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-hay-soft px-3 py-1.5 text-xs font-medium text-hay">
          <Clock size={13} aria-hidden />
          Contains pre-order items
        </p>
      )}
      {view.terminal ? (
        <TerminalNotice kind={view.terminal} />
      ) : (
        <RouteProgress
          activeStep={view.activeStep ?? 0}
          done={view.done}
          partial={view.partial}
        />
      )}
    </section>
  )
}

function RouteProgress({
  activeStep,
  done,
  partial,
}: {
  activeStep: number
  done: boolean
  partial: boolean
}) {
  return (
    <ol className="mt-7" aria-label="Delivery progress">
      {ROUTE_STEPS.map((label, i) => {
        const complete = done || i < activeStep
        const current = !done && i === activeStep
        const last = i === ROUTE_STEPS.length - 1
        return (
          <li key={label} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={`absolute top-7 bottom-1 left-[11px] border-l-2 border-dashed ${
                  complete ? 'border-moss/45' : 'border-ink/15'
                }`}
              />
            )}
            {complete ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-moss text-white">
                <Check size={14} strokeWidth={3} aria-hidden />
              </span>
            ) : current ? (
              <span className="relative flex size-6 shrink-0 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping rounded-full bg-ink/15 [animation-duration:2.2s] motion-reduce:hidden"
                />
                <span className="relative flex size-6 items-center justify-center rounded-full bg-ink">
                  <span className="size-1.5 rounded-full bg-paper" />
                </span>
              </span>
            ) : (
              <span className="size-6 shrink-0 rounded-full border-2 border-line bg-card" />
            )}
            <div className="flex min-w-0 items-center gap-2 pt-0.5">
              <span
                className={
                  current
                    ? 'font-semibold text-ink'
                    : complete
                      ? 'text-ink'
                      : 'text-ink-faint'
                }
              >
                {label}
              </span>
              {current && partial && (
                <span className="rounded-full bg-hay-soft px-2 py-0.5 text-[11px] font-medium text-hay">
                  Partial
                </span>
              )}
              {current && (
                <span className="sr-only">(current step)</span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function TerminalNotice({ kind }: { kind: 'cancelled' | 'refunded' }) {
  const cancelled = kind === 'cancelled'
  return (
    <div
      className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
        cancelled
          ? 'border-clay/25 bg-clay-soft'
          : 'border-line bg-card'
      }`}
    >
      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
          cancelled ? 'bg-clay/10 text-clay' : 'bg-paper text-ink-soft'
        }`}
      >
        {cancelled ? <Ban size={16} aria-hidden /> : <Undo2 size={16} aria-hidden />}
      </span>
      <p className={`text-sm leading-relaxed ${cancelled ? 'text-clay' : 'text-ink-soft'}`}>
        {cancelled
          ? 'If this is unexpected, contact us and we’ll help sort it out.'
          : 'The refund goes back to your original payment method. It can take a few working days to appear.'}
      </p>
    </div>
  )
}
