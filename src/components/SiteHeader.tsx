import logo from '@/assets/logo.svg'

export function SiteHeader({ reference }: { reference?: string }) {
  return (
    <header className="bg-bay">
      <div className="mx-auto flex min-h-14 w-full max-w-md items-center justify-between gap-4 px-5 py-3">
        <img src={logo} alt="Kratos Pharma" className="h-6 w-auto" />
        {reference && (
          <p className="text-right">
            <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Order
            </span>
            <span className="font-mono text-sm font-medium text-white/90">
              {reference}
            </span>
          </p>
        )}
      </div>
    </header>
  )
}
