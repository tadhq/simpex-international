export default function ComingSoon() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-slate-100 via-zinc-50 to-zinc-200">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        {/* Diagonal geometric pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60' fill='none'%3E%3Cpath d='M0 0l60 60M60 0l-60 60M-15 30l75 -75M75 30l-75 -75' stroke='%23475569' stroke-width='1.2' opacity='0.12'/%3E%3C/svg%3E\")",
            backgroundSize: '60px 60px',
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-red-100/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-tl from-slate-200/30 to-transparent blur-3xl delay-1000" />

        {/* Wholesale themed silhouettes */}
        <svg
          className="pointer-events-none absolute -left-10 top-1/3 h-40 w-40 text-slate-500/15 animate-slow-movement"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Delivery truck */}
          <path d="M3 7h11v9H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="17.5" cy="18" r="1.5" />
        </svg>

        <svg
          className="pointer-events-none absolute -right-8 top-16 h-32 w-32 text-slate-500/15 animate-slow-movement"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Stacked boxes */}
          <path d="M3 12h8v8H3z" />
          <path d="M13 4h8v8h-8z" />
          <path d="M13 14h8v6h-8z" />
        </svg>

        <svg
          className="pointer-events-none absolute left-1/2 -bottom-10 h-28 w-28 -translate-x-1/2 text-slate-500/10 animate-slow-movement"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Pallet */}
          <path d="M4 10h16v4H4z" />
          <path d="M6 14v4M10 14v4M14 14v4M18 14v4" />
        </svg>
      </div>

      {/* Grid of decorative icons */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.04]">
        <div className="grid grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-300/50 bg-gradient-to-br from-slate-100/30 to-transparent backdrop-blur-sm md:h-36 md:w-36"
            >
              <div className="h-12 w-12 rounded-lg bg-slate-400/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 py-8 md:py-10 lg:py-12">
        <div className="w-full max-w-3xl space-y-8 text-center">
          {/* Logo with animation */}
          <div className="mx-auto mb-8 md:mb-10 lg:mb-12 flex justify-center opacity-0 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 blur-xl animate-pulse" />
              <img
                src="/logoSimpex.png"
                alt="N.V. Simpex International"
                className="relative h-32 w-auto object-contain drop-shadow-lg transition-transform hover:scale-105 md:h-40"
              />
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-4 opacity-0 animate-fade-in-up">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Our B2B Platform is
              <span className="block bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
            <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          </div>

          {/* Coming Soon Progress Bar */}
          <div className="mx-auto mt-6 w-full max-w-2xl opacity-0 animate-fade-in-up animation-delay-200">
            <div className="relative overflow-hidden rounded-full border border-slate-300/70 bg-white/70 shadow-sm backdrop-blur-sm">
              {/* Track */}
              <div className="h-12 w-full" />
              {/* Fill */}
              <div className="absolute left-0 top-0 h-12 animate-cs-progress rounded-full bg-gradient-to-r from-red-600 to-red-400" />
              {/* Label */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-700 md:text-sm animate-cs-text-white">
                    Coming Soon
                  </span>
                  <span className="hidden h-1 w-1 rounded-full bg-slate-400 md:inline-block" />
                  <span className="text-xs font-semibold tracking-wide text-slate-500 md:text-sm animate-cs-text-white">
                    Preparing launch
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-slate-500">
              Loading features and pricing...
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 opacity-0 animate-fade-in-up animation-delay-200">
            <p className="mx-auto max-w-xl text-xl font-medium text-slate-700 md:text-2xl">
              We're building a powerful wholesale platform for your business needs.
            </p>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              TAD is currently building an enhanced digital experience for our B2B partners. Access
              exclusive pricing, bulk ordering, and streamlined procurement tools.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mt-10 md:mt-14 lg:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 opacity-0 animate-fade-in-up animation-delay-400">
            {[
              { value: '24/7', label: 'Order Management', color: 'red' },
              { value: 'Bulk', label: 'Wholesale Pricing', color: 'slate' },
              { value: 'Fast', label: 'Procurement', color: 'slate' },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-sm transition-all duration-300 hover:border-red-300/60 hover:shadow-xl hover:shadow-red-100/50 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div
                    className={`mb-3 text-4xl font-bold ${
                      feature.color === 'red'
                        ? 'text-red-600'
                        : 'text-slate-700 group-hover:text-red-600 transition-colors'
                    }`}
                  >
                    {feature.value}
                  </div>
                  <div className="text-sm font-medium text-slate-600">{feature.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Status indicator */}
          <div className="mt-8 md:mt-10 lg:mt-12 flex items-center justify-center gap-3 opacity-0 animate-fade-in-up animation-delay-600">
            <div className="relative">
              <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-medium text-slate-600">Platform launching soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
