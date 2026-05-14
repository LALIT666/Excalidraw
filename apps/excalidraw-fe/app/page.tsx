import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* ============ NAVBAR ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#D552A3]/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#462C7D] to-[#831C91] shadow-md">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              DrawFlow
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-500 hover:text-[#831C91] transition"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-sm text-gray-500 hover:text-[#831C91] transition"
            >
              How it works
            </a>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <button className="text-sm text-gray-600 hover:text-[#831C91] transition px-3 py-2">
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button className="rounded-full bg-gradient-to-r from-[#462C7D] to-[#D552A3] px-5 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-[#D552A3]/30 transition">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D552A3]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#462C7D]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D552A3]/20 bg-[#FF70BF]/10 px-4 py-1.5 text-sm text-[#831C91] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF70BF]" />
            Now available — start drawing free
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Think visually.
            <br />
            <span className="bg-gradient-to-r from-[#462C7D] via-[#831C91] to-[#D552A3] bg-clip-text text-transparent">
              Build together.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            DrawFlow is a simple whiteboard for sketching ideas, wireframes, and
            diagrams. No clutter, no learning curve — just open and draw.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <button className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#462C7D] to-[#831C91] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#462C7D]/20 hover:shadow-[#831C91]/30 hover:brightness-110 transition">
                Start drawing — it&apos;s free
              </button>
            </Link>
            <Link href="/signin">
              <button className="w-full sm:w-auto rounded-full border border-[#D552A3]/30 px-8 py-3.5 text-sm font-semibold text-[#831C91] hover:bg-[#FF70BF]/10 transition">
                Sign in to your board
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Preview */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute -inset-4 bg-gradient-to-b from-[#D552A3]/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative overflow-hidden rounded-2xl border border-[#D552A3]/20 bg-white shadow-2xl shadow-[#462C7D]/10">
            {/* Top bar */}
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 bg-gray-50">
              <span className="h-3 w-3 rounded-full bg-[#D552A3]/40" />
              <span className="h-3 w-3 rounded-full bg-[#FF70BF]/40" />
              <span className="h-3 w-3 rounded-full bg-[#831C91]/40" />
              <div className="ml-4 rounded-md bg-white border border-gray-200 px-3 py-1 text-xs text-gray-400">
                drawflow.app/board/my-project
              </div>
            </div>

            {/* Canvas area */}
            <div className="relative h-[400px] sm:h-[500px] bg-[#fafafa]">
              {/* Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(70,44,125,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(70,44,125,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

              {/* Toolbar */}
              <div className="absolute left-1/2 -translate-x-1/2 top-4 flex items-center gap-1 rounded-xl border border-[#D552A3]/20 bg-white px-2 py-1.5 shadow-md">
                {["Select", "Rect", "Circle", "Pencil", "Text"].map((t) => (
                  <div
                    key={t}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      t === "Rect"
                        ? "bg-[#831C91] text-white"
                        : "text-gray-400 hover:text-[#831C91] hover:bg-[#FF70BF]/10"
                    } transition`}
                  >
                    {t}
                  </div>
                ))}
              </div>

              {/* Shapes */}
              <div className="absolute left-[15%] top-[35%] h-24 w-40 rounded-xl border-2 border-[#D552A3] shadow-[0_0_20px_rgba(213,82,163,0.15)]" />
              <div className="absolute left-[45%] top-[30%] h-20 w-20 rounded-full border-2 border-[#FF70BF] shadow-[0_0_20px_rgba(255,112,191,0.15)]" />
              <div className="absolute left-[35%] top-[60%] h-16 w-48 rounded-xl border-2 border-[#462C7D] shadow-[0_0_20px_rgba(70,44,125,0.15)]" />

              {/* Lines */}
              <div className="absolute left-[35%] top-[47%] w-[12%] h-[2px] bg-gradient-to-r from-[#D552A3] to-[#831C91] rotate-[-20deg]" />
              <div className="absolute left-[55%] top-[50%] w-[2px] h-[12%] bg-gradient-to-b from-[#831C91] to-[#462C7D]" />

              {/* Labels */}
              <div className="absolute left-[17%] top-[38%] text-xs text-[#D552A3] font-semibold">
                User Flow
              </div>
              <div className="absolute left-[47%] top-[35%] text-xs text-[#FF70BF] font-semibold">
                API
              </div>
              <div className="absolute left-[39%] top-[64%] text-xs text-[#462C7D] font-semibold">
                Database
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUSTED BY ============ */}
      <section className="border-y border-[#D552A3]/10 py-10 px-6 bg-[#fdfafc]">
        <p className="text-center text-sm text-gray-400 tracking-widest uppercase">
          Trusted by teams at startups, agencies, and design studios
        </p>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#831C91] mb-3 uppercase tracking-wider">
            Features
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl text-gray-900">
            Everything you need, nothing extra
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Built for speed and simplicity. Clean interface, vibrant accents.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "✏️",
              title: "Instant sketching",
              desc: "Open the canvas and draw. Rectangle, circle, diamond, pencil — all one click away.",
              accent: "#D552A3",
            },
            {
              icon: "👥",
              title: "Real-time collaboration",
              desc: "Share a room link. Everyone draws on the same board, changes sync instantly.",
              accent: "#831C91",
            },
            {
              icon: "💾",
              title: "Auto-save",
              desc: "Your shapes are saved automatically. Come back anytime and pick up where you left off.",
              accent: "#462C7D",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg hover:shadow-[#D552A3]/10 hover:border-[#FF70BF]/30 transition duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF70BF]/10 text-2xl">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#831C91] transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="mx-auto max-w-4xl px-6 py-24 bg-[#fdfafc]">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#831C91] mb-3 uppercase tracking-wider">
            How it works
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl text-gray-900">
            Three steps. That&apos;s it.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Create account",
              desc: "Sign up in 10 seconds. No credit card required.",
            },
            {
              step: "02",
              title: "Open a room",
              desc: "Create or join a room with a simple shareable link.",
            },
            {
              step: "03",
              title: "Start drawing",
              desc: "Pick a tool and sketch. It works immediately.",
            },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#462C7D] to-[#D552A3] text-sm font-bold text-white shadow-lg shadow-[#831C91]/20">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <div className="relative overflow-hidden rounded-3xl border border-[#D552A3]/20 bg-gradient-to-br from-[#462C7D] to-[#831C91] px-8 py-16 text-center sm:px-16 shadow-2xl shadow-[#462C7D]/20">
          {/* Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[#FF70BF]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#D552A3]/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4 text-white">
              Ready to sketch your next idea?
            </h2>
            <p className="text-white/70 max-w-md mx-auto mb-8">
              Join thousands of makers who think visually. Free to start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <button className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#462C7D] hover:shadow-lg hover:shadow-white/20 transition">
                  Create free account
                </button>
              </Link>
              <Link href="/signin">
                <button className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-gray-100 px-6 py-8 bg-[#fdfafc]">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#462C7D] to-[#831C91]">
              <span className="text-xs font-bold text-white">D</span>
            </div>
            <span className="text-sm text-gray-400">DrawFlow</span>
          </div>

          <p className="text-sm text-gray-300">
            © 2025 DrawFlow. Built for visual thinkers.
          </p>

          <div className="flex gap-6">
            <Link
              href="/signin"
              className="text-sm text-gray-400 hover:text-[#831C91] transition"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm text-gray-400 hover:text-[#831C91] transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
