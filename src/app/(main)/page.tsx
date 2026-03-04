import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { interactive } from '@/lib/design-tokens';
import {
  Sandals,
  Community,
  Calendar,
  NavArrowRight,
  ClipboardCheck,
} from 'iconoir-react';

// ─── Authenticated view ────────────────────────────────────────────
async function AuthenticatedHome({ name }: { name: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display uppercase mb-8">Welcome, {name}</h1>
      <p className="mb-4">
        <Link href="/schedule" className={`font-medium ${interactive.link}`}>
          View schedule →
        </Link>
      </p>
    </div>
  );
}

// ─── Landing page sections ─────────────────────────────────────────

function LandingNav() {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 md:px-12"
      style={{ fontFamily: 'var(--font-loyly-body)' }}
    >
      <span
        className="text-sm font-semibold tracking-[0.15em] uppercase"
        style={{ color: 'var(--loyly-text)', fontFamily: 'var(--font-loyly-logo)', opacity: 0.9 }}
      >
        Löyly
      </span>
      <Link
        href="/login"
        className="text-sm font-medium tracking-wide transition-opacity hover:opacity-70"
        style={{ color: 'var(--loyly-text-muted)', fontFamily: 'var(--font-loyly-body)' }}
      >
        Login →
      </Link>
    </nav>
  );
}

function SteamWisps() {
  const wisps = [
    { left: '18%', bottom: '12%', w: 28, h: 70, cls: 'loyly-steam-1' },
    { left: '32%', bottom: '8%',  w: 20, h: 55, cls: 'loyly-steam-2' },
    { left: '50%', bottom: '14%', w: 34, h: 90, cls: 'loyly-steam-3' },
    { left: '65%', bottom: '6%',  w: 22, h: 60, cls: 'loyly-steam-4' },
    { left: '80%', bottom: '10%', w: 18, h: 50, cls: 'loyly-steam-5' },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {wisps.map((w, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${w.cls}`}
          style={{
            left: w.left,
            bottom: w.bottom,
            width: w.w,
            height: w.h,
            background: 'radial-gradient(ellipse, rgba(143,170,140,0.55) 0%, transparent 70%)',
            filter: 'blur(6px)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Section 1: Hero ────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--loyly-bg)' }}
    >
      <LandingNav />
      <SteamWisps />

      {/* Ember glow from below */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(200,74,24,0.18) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        aria-hidden
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p
          className="loyly-fade-up text-xs font-semibold tracking-[0.3em] uppercase mb-6"
          style={{ color: 'var(--loyly-steam)', fontFamily: 'var(--font-loyly-body)' }}
        >
          Amsterdam Noord
        </p>

        {/* Logo wordmark */}
        <h1
          className="loyly-fade-up-d1 font-loyly-logo leading-none mb-4"
          style={{
            fontFamily: 'var(--font-loyly-logo)',
            color: 'var(--loyly-text)',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            letterSpacing: '0.05em',
          }}
        >
          BUURTSAUNA
          <br />
          <span style={{ color: 'var(--loyly-gold)' }}>LÖYLY</span>
        </h1>

        {/* Tagline */}
        <p
          className="loyly-fade-up-d2 mt-6 mb-10 max-w-xl mx-auto leading-relaxed"
          style={{
            fontFamily: 'var(--font-loyly-heading)',
            color: 'var(--loyly-text-muted)',
            fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
            fontStyle: 'italic',
          }}
        >
          Your neighborhood sauna. Run by volunteers. Open to everyone.
        </p>

        {/* CTAs */}
        <div className="loyly-fade-up-d3 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="loyly-btn-fire inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all active:scale-[0.98]"
            style={{
              fontFamily: 'var(--font-loyly-body)',
              background: 'var(--loyly-fire)',
              color: '#fff',
              letterSpacing: '0.08em',
            }}
          >
            Become a member
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all active:scale-[0.98]"
            style={{
              fontFamily: 'var(--font-loyly-body)',
              border: '1px solid var(--loyly-border-dark)',
              color: 'var(--loyly-text)',
              letterSpacing: '0.08em',
            }}
          >
            View schedule
            <NavArrowRight width={14} height={14} />
          </Link>
        </div>

        {/* Scroll hint */}
        <div
          className="loyly-fade-up-d4 mt-16 flex flex-col items-center gap-2 opacity-40"
          style={{ color: 'var(--loyly-text-muted)' }}
          aria-hidden
        >
          <div className="w-px h-10 bg-current" />
          <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-loyly-body)' }}>Scroll</span>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Our Story ───────────────────────────────────────────
function StorySection() {
  const stats = [
    { value: '€16', label: 'Walk-in price' },
    { value: '3h', label: 'Per session' },
    { value: '5', label: 'Max. guests' },
  ];

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ background: 'var(--loyly-bg-light)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Text column */}
          <div>
            <p
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--loyly-fire)', fontFamily: 'var(--font-loyly-body)' }}
            >
              Our story
            </p>
            <h2
              className="mb-6 leading-tight"
              style={{
                fontFamily: 'var(--font-loyly-heading)',
                color: 'var(--loyly-text-dark)',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              Born from a neighborhood dream
            </h2>
            <div
              className="space-y-4 leading-relaxed"
              style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-text-mid)', fontSize: '1.0625rem' }}
            >
              <p>
                Barnaby and Camille live in the van der Pekbuurt with their two daughters, dog Aksu and cat Minoush.
                They share a love for their neighborhood, for community — and for Finnish sauna.
              </p>
              <p>
                From those three things came one idea: build a community sauna right here in Amsterdam Noord,
                where neighbors could meet, steam together, and simply be present.
              </p>
              <p>
                Together with the community at 't Keerwater on the Buiksloterweg, Buurtsauna Löyly was born.
                The container is built. The sauna is installed. Now it's time to steam.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote
              className="mt-8 pl-5 py-1 italic text-lg leading-snug"
              style={{
                borderLeft: '3px solid var(--loyly-fire)',
                fontFamily: 'var(--font-loyly-heading)',
                color: 'var(--loyly-text-dark)',
              }}
            >
              "Sauna should be accessible to everyone, regularly — not a luxury but a habit."
            </blockquote>
          </div>

          {/* Visual column */}
          <div className="flex flex-col gap-6">
            {/* Decorative sauna stones pattern */}
            <div
              className="rounded-sm overflow-hidden flex items-center justify-center"
              style={{
                height: 280,
                background: 'var(--loyly-bg-warm)',
                position: 'relative',
              }}
            >
              {/* Löyly word as large decorative element */}
              <span
                aria-hidden
                style={{
                  fontFamily: 'var(--font-loyly-logo)',
                  fontSize: '7rem',
                  fontWeight: 700,
                  color: 'rgba(196,144,64,0.12)',
                  letterSpacing: '0.05em',
                  userSelect: 'none',
                  lineHeight: 1,
                }}
              >
                löyly
              </span>
              <div
                className="absolute bottom-4 left-4 right-4"
                style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-text-muted)', fontSize: '0.75rem', letterSpacing: '0.08em' }}
              >
                BUIKSLOTERWEG · AMSTERDAM NOORD
              </div>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(s => (
                <div
                  key={s.label}
                  className="p-4 text-center"
                  style={{ border: '1px solid var(--loyly-border-light)', background: 'var(--loyly-bg-lighter)' }}
                >
                  <div
                    style={{ fontFamily: 'var(--font-loyly-heading)', color: 'var(--loyly-fire)', fontWeight: 700, fontSize: '1.75rem' }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-text-mid)', fontSize: '0.75rem', marginTop: 2 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: How It Works ────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: <Community width={28} height={28} />,
      title: 'Create your account',
      body: 'Register in minutes. All you need is a name, email and phone number. No approval process.',
    },
    {
      num: '02',
      icon: <Calendar width={28} height={28} />,
      title: 'Pick your session',
      body: 'Browse the weekly schedule. Every 3-hour session is hosted by a volunteer neighbour. Find one that fits.',
    },
    {
      num: '03',
      icon: <Sandals width={28} height={28} />,
      title: 'Steam and connect',
      body: "Show up, relax, meet your neighbours. Your löyly* session awaits.\n\n*Finnish for sauna steam.",
    },
  ];

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ background: 'var(--loyly-bg-warm)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--loyly-steam)', fontFamily: 'var(--font-loyly-body)' }}
          >
            Getting started
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-loyly-heading)',
              color: 'var(--loyly-text)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Three simple steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px" style={{ background: 'var(--loyly-border-dark)' }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className="p-8 flex flex-col gap-5"
              style={{ background: 'var(--loyly-bg-warm)' }}
            >
              <div className="flex items-start justify-between">
                <div style={{ color: 'var(--loyly-steam)' }}>{step.icon}</div>
                <span
                  style={{
                    fontFamily: 'var(--font-loyly-logo)',
                    color: 'var(--loyly-gold)',
                    opacity: 0.5,
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-loyly-heading)',
                  color: 'var(--loyly-text)',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-loyly-body)',
                  color: 'var(--loyly-text-muted)',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-line',
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
            style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-fire)' }}
          >
            Create your account
            <NavArrowRight width={14} height={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Memberships ─────────────────────────────────────────
function PlansSection() {
  const plans = [
    { label: 'Walk-in', price: '€16', unit: 'per visit', desc: 'Drop in whenever you like. No commitment.', highlight: false },
    { label: '2× / month', price: '€25', unit: '/ month', desc: '2 credits monthly. Min. 3-month duration.', highlight: false },
    { label: '4× / month', price: '€40', unit: '/ month', desc: '4 credits monthly. Min. 2-month duration.', highlight: true },
    { label: '8× / month', price: '€64', unit: '/ month', desc: '8 credits monthly. Min. 1-month duration.', highlight: false },
    { label: 'Unlimited', price: '€80', unit: '/ month', desc: 'Unlimited visits. Our most flexible plan.', highlight: false },
    { label: 'Punch card ×5', price: '€75', unit: 'valid 3 months', desc: '5 credits to use at your own pace.', highlight: false },
  ];

  return (
    <section
      className="py-24 md:py-32 px-6"
      style={{ background: 'var(--loyly-bg-light)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--loyly-fire)', fontFamily: 'var(--font-loyly-body)' }}
          >
            Pricing
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-loyly-heading)',
              color: 'var(--loyly-text-dark)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Simple, affordable access
          </h2>
          <p
            className="mt-3 max-w-lg mx-auto"
            style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-text-mid)', fontSize: '1rem' }}
          >
            Choose what fits your rhythm. All members get access to every session in the schedule.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div
              key={plan.label}
              className="relative p-6 flex flex-col gap-3 transition-transform hover:-translate-y-0.5"
              style={{
                background: plan.highlight ? 'var(--loyly-bg-warm)' : 'var(--loyly-bg-lighter)',
                border: plan.highlight
                  ? '1px solid var(--loyly-fire)'
                  : '1px solid var(--loyly-border-light)',
              }}
            >
              {plan.highlight && (
                <span
                  className="absolute -top-3 left-6 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ background: 'var(--loyly-fire)', color: '#fff', fontFamily: 'var(--font-loyly-body)' }}
                >
                  Popular
                </span>
              )}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-loyly-body)',
                    color: plan.highlight ? 'var(--loyly-text-muted)' : 'var(--loyly-text-mid)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {plan.label}
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-loyly-heading)',
                      color: plan.highlight ? 'var(--loyly-text)' : 'var(--loyly-text-dark)',
                      fontWeight: 700,
                      fontSize: '2rem',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-loyly-body)',
                      color: plan.highlight ? 'var(--loyly-text-muted)' : 'var(--loyly-text-mid)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {plan.unit}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-loyly-body)',
                  color: plan.highlight ? 'var(--loyly-text-muted)' : 'var(--loyly-text-mid)',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                }}
              >
                {plan.desc}
              </p>
              <div className="mt-auto pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-60"
                  style={{
                    fontFamily: 'var(--font-loyly-body)',
                    color: plan.highlight ? 'var(--loyly-gold)' : 'var(--loyly-fire)',
                  }}
                >
                  Choose this plan <NavArrowRight width={12} height={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-8 text-center text-sm"
          style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-text-mid)' }}
        >
          All memberships include access to the full weekly schedule. Questions?{' '}
          <a href="mailto:hello@loyly.nl" className="underline hover:no-underline" style={{ color: 'var(--loyly-fire)' }}>
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
}

// ─── Section 5: Community & Hosts ──────────────────────────────────
function CommunitySection() {
  const values = [
    { icon: <Community width={20} height={20} />, text: 'Run by neighbors, for neighbors' },
    { icon: <ClipboardCheck width={20} height={20} />, text: 'Each host brings their own style' },
    { icon: <Sandals width={20} height={20} />, text: 'Themed sessions: meditation, women-only, and more' },
    { icon: <Calendar width={20} height={20} />, text: 'Hosts commit to one 3-hour slot per period' },
  ];

  return (
    <section
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      style={{ background: 'var(--loyly-bg)' }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px]"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(143,170,140,0.06) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Visual */}
          <div
            className="flex items-center justify-center"
            style={{
              height: 340,
              background: 'var(--loyly-bg-mid)',
              border: '1px solid var(--loyly-border-dark)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span
              aria-hidden
              style={{
                fontFamily: 'var(--font-loyly-logo)',
                fontSize: '10rem',
                fontWeight: 700,
                color: 'rgba(143,170,140,0.07)',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              ❊
            </span>
            <div
              className="absolute bottom-0 left-0 right-0 p-5"
              style={{ borderTop: '1px solid var(--loyly-border-dark)', fontFamily: 'var(--font-loyly-body)' }}
            >
              <p style={{ color: 'var(--loyly-steam)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Volunteer hosts
              </p>
              <p style={{ color: 'var(--loyly-text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
                Every session has a host. Every host makes it their own.
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--loyly-steam)', fontFamily: 'var(--font-loyly-body)' }}
            >
              Community
            </p>
            <h2
              className="mb-6 leading-tight"
              style={{
                fontFamily: 'var(--font-loyly-heading)',
                color: 'var(--loyly-text)',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)',
              }}
            >
              Sauna powered by volunteers
            </h2>
            <p
              className="mb-8 leading-relaxed"
              style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-text-muted)', fontSize: '1rem' }}
            >
              We don't hire staff. Our sessions are hosted by community members who each bring their own personality
              to the experience — guided meditations, women-only evenings, live music, and more.
            </p>

            <ul className="space-y-4 mb-8">
              {values.map((v, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--loyly-steam)', marginTop: 2 }}>{v.icon}</span>
                  <span style={{ fontFamily: 'var(--font-loyly-body)', color: 'var(--loyly-text)', fontSize: '0.9rem' }}>{v.text}</span>
                </li>
              ))}
            </ul>

            <a
              href="mailto:hello@loyly.nl"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-colors"
              style={{
                fontFamily: 'var(--font-loyly-body)',
                border: '1px solid var(--loyly-steam)',
                color: 'var(--loyly-steam)',
              }}
            >
              Become a host
              <NavArrowRight width={14} height={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Join CTA ─────────────────────────────────────────────
function JoinSection() {
  return (
    <section
      className="py-28 md:py-40 px-6 text-center relative overflow-hidden"
      style={{ background: 'var(--loyly-bg-warm)' }}
    >
      {/* Deep ember glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(200,74,24,0.15) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <p
          className="text-xs font-semibold tracking-[0.3em] uppercase mb-6"
          style={{ color: 'var(--loyly-gold)', fontFamily: 'var(--font-loyly-body)' }}
        >
          Ready?
        </p>
        <h2
          className="mb-6 leading-tight"
          style={{
            fontFamily: 'var(--font-loyly-heading)',
            color: 'var(--loyly-text)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          }}
        >
          Steam with your neighbors
        </h2>
        <p
          className="mb-10 leading-relaxed"
          style={{
            fontFamily: 'var(--font-loyly-body)',
            color: 'var(--loyly-text-muted)',
            fontSize: '1.0625rem',
            maxWidth: '32rem',
            margin: '0 auto 2.5rem',
          }}
        >
          Join Buurtsauna Löyly and become part of a community that sweats, connects, and grows together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-sm font-semibold tracking-[0.1em] uppercase transition-all active:scale-[0.98]"
            style={{
              fontFamily: 'var(--font-loyly-body)',
              background: 'var(--loyly-fire)',
              color: '#fff',
            }}
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-sm font-semibold tracking-[0.1em] uppercase transition-all hover:opacity-70"
            style={{
              fontFamily: 'var(--font-loyly-body)',
              color: 'var(--loyly-text-muted)',
            }}
          >
            Already a member? Log in
          </Link>
        </div>

        <p
          className="mt-14 text-xs"
          style={{
            fontFamily: 'var(--font-loyly-body)',
            color: 'var(--loyly-text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          *löyly — Finnish for the sacred steam of the sauna
        </p>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────
function LandingFooter() {
  return (
    <footer
      className="py-8 px-6"
      style={{
        background: 'var(--loyly-bg)',
        borderTop: '1px solid var(--loyly-border-dark)',
      }}
    >
      <div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ fontFamily: 'var(--font-loyly-body)' }}
      >
        <span
          style={{ fontFamily: 'var(--font-loyly-logo)', color: 'var(--loyly-gold)', fontSize: '0.85rem', letterSpacing: '0.1em' }}
        >
          BUURTSAUNA LÖYLY
        </span>
        <span style={{ color: 'var(--loyly-text-muted)', fontSize: '0.75rem' }}>
          Amsterdam Noord · Buiksloterweg
        </span>
        <div className="flex gap-6" style={{ color: 'var(--loyly-text-muted)', fontSize: '0.75rem' }}>
          <Link href="/login" className="hover:opacity-70 transition-opacity">Login</Link>
          <a href="mailto:hello@loyly.nl" className="hover:opacity-70 transition-opacity">Contact</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Page component ──────────────────────────────────────────────────
export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return <AuthenticatedHome name={session.user.name || 'neighbor'} />;
  }

  return (
    <main>
      <HeroSection />
      <StorySection />
      <HowItWorksSection />
      <PlansSection />
      <CommunitySection />
      <JoinSection />
      <LandingFooter />
    </main>
  );
}
