import Link from "next/link";

const features = [
  {
    title: "Instant sketching",
    desc: "Open the canvas and start drawing immediately without clutter or distractions.",
  },
  {
    title: "Real-time collaboration",
    desc: "Share links, brainstorm together, and turn rough ideas into clear visual flows.",
  },
  {
    title: "Simple export",
    desc: "Export boards in clean formats and drop them into docs, decks, or product specs.",
  },
];

const benefits = [
  "Minimal UI built for focus",
  "Smooth dark interface",
  "Canvas-first experience",
  "Fast and distraction-free",
];

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" />
      </div>

      {/* Navbar */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
            <span className="text-lg font-semibold">✦</span>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-wide">DrawFlow</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Features
          </a>
          <a
            href="#preview"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Preview
          </a>
          <a
            href="#cta"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Get Started
          </a>
        </nav>

        <button className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15">
          Launch App
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-8 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-16">
        {/* Left */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
            Clean canvas for ideas, wireframes, and flows
          </div>

          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Sketch ideas
            <span className="block bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              with DrawFlow
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
            Build an Excalidraw-style experience with a polished landing page,
            minimal layout, dark gradients, and a sharp product-first feel.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={"/signup"}>
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">
                Sign up
              </button>
            </Link>
            <Link href={"/signin"}>
              <button className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                Sign in
              </button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75 backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right preview */}
        <div id="preview" className="relative mx-auto w-full max-w-[620px]">
          <div className="absolute -left-10 top-12 h-24 w-24 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -right-8 bottom-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1020]">
              {/* top bar */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  Untitled Board
                </div>
                <div className="text-xs text-white/45">Auto-saved</div>
              </div>

              {/* canvas */}
              <div className="relative h-[430px] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />

                {/* left toolbar */}
                <div className="absolute left-4 top-4 z-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                  {["□", "／", "T", "↗", "◯"].map((tool) => (
                    <div
                      key={tool}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/75"
                    >
                      {tool}
                    </div>
                  ))}
                </div>

                {/* floating top tools */}
                <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
                  {["Select", "Shape", "Text", "Arrow"].map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* fake nodes / shapes */}
                <div className="absolute left-[120px] top-[100px] rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-4 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-500/10">
                  Idea
                </div>

                <div className="absolute left-[300px] top-[80px] rounded-2xl border border-indigo-400/30 bg-indigo-400/10 px-5 py-4 text-sm font-medium text-indigo-100 shadow-lg shadow-indigo-500/10">
                  Wireframe
                </div>

                <div className="absolute left-[260px] top-[240px] rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm font-medium text-emerald-100 shadow-lg shadow-emerald-500/10">
                  Final Flow
                </div>

                {/* connector lines */}
                <div className="absolute left-[205px] top-[145px] h-[2px] w-[105px] bg-gradient-to-r from-cyan-300/70 to-indigo-300/70" />
                <div className="absolute left-[340px] top-[150px] h-[95px] w-[2px] bg-gradient-to-b from-indigo-300/70 to-emerald-300/70" />

                {/* notes */}
                <div className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Collaboration
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Clean canvas. Fast thinking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-white/40">
            Features
          </p>
          <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built to feel calm, modern, and focused
          </h3>
          <p className="mt-4 text-white/65">
            A landing page that looks premium without being noisy.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm text-white/70">
                0{i + 1}
              </div>
              <h4 className="text-xl font-semibold">{feature.title}</h4>
              <p className="mt-3 leading-7 text-white/65">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 px-6 py-12 backdrop-blur-xl sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_40%)]" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                Ready to launch?
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create your clean Excalidraw-style landing page
              </h3>
              <p className="mt-4 text-white/65">
                Minimal, premium, and built with only Tailwind utility classes.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">
                Build Now
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/45">
        © 2025 DrawFlow. Clean UI for visual thinking.
      </footer>
    </main>
  );
}
