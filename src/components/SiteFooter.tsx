export function SiteFooter({ reference }: { reference?: string }) {
  return (
    <footer className="px-6 pt-10 pb-12 text-center">
      <p className="text-sm leading-relaxed text-ink-soft">
        Questions about your order? Reply to the message that sent you this
        link and we’ll help.
      </p>
      {reference && (
        <p className="mt-3 font-mono text-xs text-ink-faint">
          Ref {reference}
        </p>
      )}
    </footer>
  )
}
