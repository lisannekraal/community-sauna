import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { interactive } from '@/lib/design-tokens';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display uppercase mb-8">Welcome, {session.user.name}</h1>
        <p className="mb-4">
          <Link href="/schedule" className={`font-medium ${interactive.link}`}>
            View schedule →
          </Link>
        </p>
      </div>
    );
  }

  // ─── Guest landing page ───────────────────────────────────────────────
  return (
    <div className="font-sans overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-ly-dark/95 backdrop-blur-sm">
        <span className="font-logo text-ly-cream text-xl tracking-widest uppercase">
          Löyly
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="#about"
            className="text-ly-cream/60 hover:text-ly-cream text-xs font-mono uppercase tracking-wider transition-colors hidden sm:block"
          >
            About
          </Link>
          <Link
            href="#membership"
            className="text-ly-cream/60 hover:text-ly-cream text-xs font-mono uppercase tracking-wider transition-colors hidden sm:block"
          >
            Membership
          </Link>
          <Link
            href="#schedule"
            className="text-ly-cream/60 hover:text-ly-cream text-xs font-mono uppercase tracking-wider transition-colors hidden md:block"
          >
            Schedule
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-ly-cream/30 text-ly-cream text-xs font-mono uppercase tracking-wider hover:bg-ly-cream hover:text-ly-dark transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* ── Section 1: Hero ── */}
      <section className="relative min-h-screen bg-ly-dark flex items-center justify-center overflow-hidden">
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 3px,
              rgba(196,121,65,0.6) 3px,
              rgba(196,121,65,0.6) 4px
            )`
          }}
        />
        {/* Atmospheric rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-ly-amber/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-ly-amber/10" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <p className="font-mono text-ly-amber/70 text-[10px] uppercase tracking-[0.5em] mb-8">
            Amsterdam Noord · Est. 2026
          </p>

          <h1
            className="font-logo text-ly-cream leading-none mb-3 uppercase"
            style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}
          >
            Löyly
          </h1>

          <p className="font-mono text-ly-stone text-xs uppercase tracking-[0.35em] mb-10">
            Buurtsauna
          </p>

          <div className="w-16 h-px bg-ly-amber mx-auto mb-10" />

          <p className="font-heading-ly text-ly-cream/80 text-xl md:text-2xl italic mb-5 max-w-xl mx-auto leading-relaxed">
            Where community meets the sacred steam
          </p>

          <p className="text-ly-stone text-sm mb-14 max-w-md mx-auto leading-relaxed">
            A neighborhood sauna in Amsterdam Noord — accessible, affordable,
            and run by the community, for the community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-9 py-4 bg-ly-amber text-ly-dark font-mono text-sm uppercase tracking-wider hover:bg-ly-amber-dark transition-colors"
            >
              Join the community →
            </Link>
            <Link
              href="#about"
              className="px-9 py-4 border border-ly-cream/25 text-ly-cream font-mono text-sm uppercase tracking-wider hover:bg-ly-cream/10 transition-colors"
            >
              Our story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-mono text-ly-stone text-[9px] uppercase tracking-[0.4em]">Scroll</span>
          <div className="w-px h-7 bg-gradient-to-b from-ly-stone/60 to-transparent" />
        </div>
      </section>

      {/* ── Section 2: Our Story ── */}
      <section id="about" className="bg-ly-cream py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-ly-stone text-[10px] uppercase tracking-[0.4em] mb-14">
            — Our story
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-heading-ly text-ly-dark text-4xl md:text-5xl leading-tight mb-8">
                Born from a love for neighborhood, and the Finnish sauna
              </h2>
              <div className="w-12 h-0.5 bg-ly-amber mb-10" />
              <p className="font-heading-ly text-ly-stone text-xl italic leading-relaxed mb-6 max-w-sm">
                "We share so much with our neighbors already — our street, our lives.
                Why not our sauna?"
              </p>
              <p className="font-mono text-ly-stone text-[10px] uppercase tracking-wider">
                — Barnaby &amp; Camille, founders
              </p>
            </div>

            <div className="space-y-5 text-ly-dark/80 leading-relaxed text-[15px]">
              <p>
                We are Barnaby and Camille, and we live with our two daughters in
                the Van der Pekbuurt in Amsterdam Noord. Alongside our family, our
                home, and our close community, we share a deep love for the
                neighborhood — and for Finnish sauna.
              </p>
              <p>
                From these three loves, an idea was born: a sauna rooted in our
                neighborhood. After a survey showed real enthusiasm from locals,
                we decided to make it happen.
              </p>
              <p>
                Sauna is a place to come together — to talk, relax, sweat, and
                refresh, both mentally and physically. It should be accessible to
                everyone, regularly and affordably. That is what Buurtsauna Löyly
                sets out to create.
              </p>
              <p>
                Our volunteer hosts bring their own spirit to each session — from
                guided meditations to women-only slots — making every visit a
                little different.
              </p>

              <div className="pt-4 border-t border-ly-stone/20">
                <p className="font-mono text-ly-stone text-[10px] uppercase tracking-wider">
                  't Keerwater · Buiksloterweg · Amsterdam Noord
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Löyly Definition + Experience Grid ── */}
      <section className="bg-ly-dark py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Definition block */}
          <div className="mb-16 border-b border-ly-stone/20 pb-16">
            <p className="font-mono text-ly-amber text-[10px] uppercase tracking-[0.4em] mb-5">
              löy·ly &nbsp;/ˈløy.ly/ &nbsp;— Finnish, noun
            </p>
            <h2 className="font-heading-ly text-ly-cream text-3xl md:text-5xl lg:text-6xl italic leading-tight max-w-3xl">
              The sacred steam that rises when water meets the sauna stones.
            </h2>
          </div>

          {/* 4-feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-ly-stone/20">
            {[
              {
                number: '01',
                title: 'Authentic Finnish Sauna',
                desc: 'A real löyly ritual with birch branches, cedar wood, and the art of steam — the way it was meant to be.',
              },
              {
                number: '02',
                title: 'Community Hosted',
                desc: 'Each session is run by a volunteer host from the neighborhood, bringing their own unique touch.',
              },
              {
                number: '03',
                title: 'Affordable for All',
                desc: 'From walk-in sessions to monthly memberships — we keep it accessible for every budget.',
              },
              {
                number: '04',
                title: 'Your Ritual',
                desc: "Themed sessions, guided meditation, women-only slots — there's a löyly experience for everyone.",
              },
            ].map((item, i) => (
              <div
                key={item.number}
                className={`p-8 ${
                  i % 2 === 0 ? 'border-b lg:border-b-0' : 'border-b lg:border-b-0'
                } ${i < 3 ? 'lg:border-r' : ''} border-ly-stone/20`}
              >
                <p className="font-mono text-ly-amber text-[10px] mb-5">{item.number}</p>
                <h3 className="font-heading-ly text-ly-cream text-xl mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-ly-stone text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: How it works ── */}
      <section id="schedule" className="bg-ly-steam py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-ly-stone text-[10px] uppercase tracking-[0.4em] mb-5">
            — How to visit
          </p>
          <h2 className="font-heading-ly text-ly-dark text-4xl md:text-5xl leading-tight mb-16 max-w-lg">
            From first visit to regular ritual
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '1',
                title: 'Browse the schedule',
                desc: 'Find a session that works for you — evening sessions, weekends, themed slots.',
              },
              {
                step: '2',
                title: 'Create your account',
                desc: 'Quick sign-up with just your name, email, and phone. No fuss.',
              },
              {
                step: '3',
                title: 'Book and confirm',
                desc: 'Choose your membership or pay for a single session. Instantly confirmed.',
              },
              {
                step: '4',
                title: 'Arrive and unwind',
                desc: 'The address is revealed upon booking. Just bring yourself and a towel.',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`p-8 border-b last:border-b-0 lg:border-b-0 ${
                  i < 3 ? 'lg:border-r' : ''
                } border-ly-stone/30`}
              >
                <div className="w-8 h-8 border border-ly-amber flex items-center justify-center mb-6">
                  <span className="font-mono text-ly-amber text-xs">{item.step}</span>
                </div>
                <h3 className="font-heading-ly text-ly-dark text-xl mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-ly-stone text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              href="/schedule"
              className="inline-block px-8 py-4 border-2 border-ly-dark text-ly-dark font-mono text-sm uppercase tracking-wider hover:bg-ly-dark hover:text-ly-cream transition-colors"
            >
              View the schedule →
            </Link>
            <Link
              href="/register"
              className="font-mono text-ly-stone text-xs uppercase tracking-wider hover:text-ly-dark transition-colors"
            >
              Or create an account first
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Membership ── */}
      <section id="membership" className="bg-ly-cream py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-ly-stone text-[10px] uppercase tracking-[0.4em] mb-5">
            — Membership
          </p>
          <h2 className="font-heading-ly text-ly-dark text-4xl md:text-5xl leading-tight mb-4 max-w-xl">
            Find your rhythm
          </h2>
          <p className="text-ly-stone mb-14 max-w-lg text-[15px] leading-relaxed">
            From a casual walk-in to a dedicated monthly ritual — pick the
            membership that fits your life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Walk-in */}
            <div className="border border-ly-stone/30 p-6 hover:border-ly-amber transition-colors">
              <p className="font-mono text-ly-stone text-[10px] uppercase tracking-widest mb-5">
                Walk-in
              </p>
              <p className="font-heading-ly text-4xl text-ly-dark mb-1">€16</p>
              <p className="text-ly-stone text-sm mb-7">per session</p>
              <ul className="space-y-2.5 mb-8">
                {['Single visit', 'No commitment', 'Book anytime'].map(f => (
                  <li key={f} className="text-ly-dark text-sm flex gap-2.5">
                    <span className="text-ly-amber flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center px-4 py-3 border border-ly-dark text-ly-dark font-mono text-[10px] uppercase tracking-wider hover:bg-ly-dark hover:text-ly-cream transition-colors"
              >
                Book now
              </Link>
            </div>

            {/* Monthly — featured */}
            <div className="border border-ly-amber p-6 bg-ly-amber/[0.04] relative">
              <div className="absolute -top-3 left-6 bg-ly-amber px-3 py-1">
                <span className="font-mono text-ly-dark text-[9px] uppercase tracking-wider">
                  Popular
                </span>
              </div>
              <p className="font-mono text-ly-stone text-[10px] uppercase tracking-widest mb-5">
                Monthly
              </p>
              <p className="font-heading-ly text-4xl text-ly-dark mb-1">€40</p>
              <p className="text-ly-stone text-sm mb-7">4 sessions / month</p>
              <ul className="space-y-2.5 mb-8">
                {['4 credits monthly', 'Min. 2 months', 'Priority booking'].map(f => (
                  <li key={f} className="text-ly-dark text-sm flex gap-2.5">
                    <span className="text-ly-amber flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center px-4 py-3 bg-ly-amber text-ly-dark font-mono text-[10px] uppercase tracking-wider hover:bg-ly-amber-dark transition-colors"
              >
                Start membership
              </Link>
            </div>

            {/* Punch card */}
            <div className="border border-ly-stone/30 p-6 hover:border-ly-amber transition-colors">
              <p className="font-mono text-ly-stone text-[10px] uppercase tracking-widest mb-5">
                Punch card
              </p>
              <p className="font-heading-ly text-4xl text-ly-dark mb-1">€75</p>
              <p className="text-ly-stone text-sm mb-7">5 sessions · 3 months</p>
              <ul className="space-y-2.5 mb-8">
                {['5 credits total', '3 month validity', 'Use at your pace'].map(f => (
                  <li key={f} className="text-ly-dark text-sm flex gap-2.5">
                    <span className="text-ly-amber flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center px-4 py-3 border border-ly-dark text-ly-dark font-mono text-[10px] uppercase tracking-wider hover:bg-ly-dark hover:text-ly-cream transition-colors"
              >
                Buy card
              </Link>
            </div>

            {/* Unlimited */}
            <div className="border border-ly-stone/30 p-6 hover:border-ly-amber transition-colors">
              <p className="font-mono text-ly-stone text-[10px] uppercase tracking-widest mb-5">
                Unlimited
              </p>
              <p className="font-heading-ly text-4xl text-ly-dark mb-1">€80</p>
              <p className="text-ly-stone text-sm mb-7">per month</p>
              <ul className="space-y-2.5 mb-8">
                {['Unlimited sessions', 'Min. 1 month', 'True dedication'].map(f => (
                  <li key={f} className="text-ly-dark text-sm flex gap-2.5">
                    <span className="text-ly-amber flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center px-4 py-3 border border-ly-dark text-ly-dark font-mono text-[10px] uppercase tracking-wider hover:bg-ly-dark hover:text-ly-cream transition-colors"
              >
                Go unlimited
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-ly-stone text-sm">
            New to sauna?{' '}
            <Link href="/register" className="text-ly-amber hover:underline">
              Start with a free one-month trial
            </Link>{' '}
            — unlimited sessions, no commitment.
          </p>
        </div>
      </section>

      {/* ── Section 6: Join CTA ── */}
      <section className="bg-ly-amber py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-ly-dark/50 text-[10px] uppercase tracking-[0.5em] mb-8">
            — Join Buurtsauna Löyly
          </p>
          <h2
            className="font-logo text-ly-dark uppercase leading-none mb-8"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
          >
            Ready to steam?
          </h2>
          <p className="font-heading-ly text-ly-dark/75 text-xl italic mb-14 max-w-lg mx-auto leading-relaxed">
            Join our growing community of sauna lovers in Amsterdam Noord.
            Your first visit could be this week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-ly-dark text-ly-cream font-mono text-sm uppercase tracking-wider hover:bg-ly-dark/80 transition-colors"
            >
              Create account →
            </Link>
            <Link
              href="/schedule"
              className="px-10 py-4 border-2 border-ly-dark text-ly-dark font-mono text-sm uppercase tracking-wider hover:bg-ly-dark/10 transition-colors"
            >
              View schedule
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-ly-dark py-16 px-6 border-t border-ly-stone/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
            <div>
              <h3
                className="font-logo text-ly-cream uppercase mb-2"
                style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}
              >
                LÖYLY
              </h3>
              <p className="font-mono text-ly-stone text-[10px] uppercase tracking-wider mb-5">
                Buurtsauna
              </p>
              <p className="text-ly-stone text-sm leading-relaxed max-w-xs">
                A community sauna in Amsterdam Noord, by and for the neighborhood.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-ly-cream text-[10px] uppercase tracking-wider mb-6">
                Navigate
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Schedule', href: '/schedule' },
                  { label: 'About', href: '#about' },
                  { label: 'Membership', href: '#membership' },
                  { label: 'Register', href: '/register' },
                  { label: 'Login', href: '/login' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-ly-stone hover:text-ly-cream text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-ly-cream text-[10px] uppercase tracking-wider mb-6">
                Location
              </h4>
              <p className="text-ly-stone text-sm leading-relaxed mb-5">
                &apos;t Keerwater
                <br />
                Buiksloterweg
                <br />
                Amsterdam Noord
              </p>
              <a
                href="mailto:hallo@buurtsauna.nl"
                className="font-mono text-ly-stone text-[10px] uppercase tracking-wider hover:text-ly-cream transition-colors"
              >
                hallo@buurtsauna.nl
              </a>
            </div>
          </div>

          <div className="border-t border-ly-stone/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="font-mono text-ly-stone text-[10px]">
              © 2024 Buurtsauna Löyly — Amsterdam Noord
            </p>
            <p className="font-mono text-ly-stone text-[10px] italic">
              löyly: the sacred steam
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
