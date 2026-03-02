import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { buttons, colors, interactive, sections, typography } from '@/lib/design-tokens';

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

  return (
    <div className={`min-h-screen ${colors.bgSecondary} ${colors.textPrimary}`}>
      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12">
        {/* 1. Hero */}
        <section className="grid grid-cols-1 md:grid-cols-[2fr,1.2fr] gap-8 items-start">
          <div className="space-y-4">
            <div className="inline-block border-2 border-black px-3 py-1">
              <p className={`${typography.mono.label}`}>Neighborhood sauna • Amsterdam Noord</p>
            </div>
            <h1 className="font-display uppercase text-4xl md:text-5xl lg:text-6xl leading-tight">
              Buurtsauna Löyly
            </h1>
            <p className={`text-base md:text-lg leading-relaxed ${colors.textSubtle}`}>
              A DIY neighborhood sauna where you can sweat, slow down and meet your neighbors. Affordable, welcoming
              and run together with our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                href="/register"
                className={`${buttons.panel} ${buttons.panelPrimary} w-full sm:w-auto text-center`}
              >
                Book your first session
              </Link>
              <Link
                href="/plans"
                className={`${buttons.panel} ${buttons.panelSecondary} w-full sm:w-auto text-center`}
              >
                Learn about memberships
              </Link>
            </div>
            <p className={`${typography.mono.caption} ${colors.textSubtle}`}>
              No experience needed. Just bring a towel and an open mind.
            </p>
          </div>

          <div className="border-2 border-black bg-gray-100 p-4 md:p-6 space-y-3">
            <h2 className="font-display uppercase text-lg">This week at Löyly</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Wed • Mixed evening</span>
                <span className={typography.mono.tiny}>3 of 5 spots left</span>
              </li>
              <li className="flex justify-between">
                <span>Fri • Quiet morning</span>
                <span className={typography.mono.tiny}>2 of 5 spots left</span>
              </li>
              <li className="flex justify-between">
                <span>Sun • Women &amp; non-binary</span>
                <span className={typography.mono.tiny}>1 of 5 spots left</span>
              </li>
            </ul>
            <p className={`text-xs ${colors.textSubtle}`}>
              Log in or create an account to see the full schedule and book your spot.
            </p>
            <Link
              href="/login"
              className={`${buttons.base} ${buttons.secondary} mt-1 md:mt-2 w-full text-center`}
            >
              View full schedule
            </Link>
          </div>
        </section>

        <div className={sections.divider} />

        {/* 2. Story & vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h2 className="font-display uppercase text-2xl">A sauna for our neighbors</h2>
            <p className="text-base leading-relaxed">
              Buurtsauna Löyly is started by Barnaby and Camille and built together with neighbors in Amsterdam Noord.
              We turn a simple container into a warm place to meet, talk and breathe out the week.
            </p>
            <p className={`text-base leading-relaxed ${colors.textSubtle}`}>
              We believe regular sauna should be accessible to everyone, not just a luxury wellness trip. That means
              fair pricing, clear rules and a space where you can feel at ease in your own body.
            </p>
          </div>
          <div className="border-2 border-black bg-gray-100 p-4 md:p-6 space-y-3">
            <h3 className="font-display uppercase text-lg">Why a neighborhood sauna?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Meet people from your own street and block</li>
              <li>Slow, screen-free time in a warm, held space</li>
              <li>Community rates and trial options for new members</li>
              <li>Volunteers host their own sessions and add their own flavor</li>
            </ul>
          </div>
        </section>

        <div className={sections.divider} />

        {/* 3. How it works */}
        <section className="space-y-4">
          <div className="space-y-2">
            <p className={typography.mono.label}>How it works</p>
            <h2 className="font-display uppercase text-2xl">From first visit to regular steam</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-2 border-black p-4 space-y-2">
              <p className={typography.mono.label}>Step 1</p>
              <h3 className="font-display uppercase text-sm">Create your account</h3>
              <p className="text-sm leading-relaxed">
                Sign up with your email and phone number so we can confirm your bookings and reach you if needed.
              </p>
            </div>
            <div className="border-2 border-black p-4 space-y-2">
              <p className={typography.mono.label}>Step 2</p>
              <h3 className="font-display uppercase text-sm">Pick a session</h3>
              <p className="text-sm leading-relaxed">
                Browse the weekly schedule, choose a time slot that fits you and reserve your spot.
              </p>
            </div>
            <div className="border-2 border-black p-4 space-y-2">
              <p className={typography.mono.label}>Step 3</p>
              <h3 className="font-display uppercase text-sm">Arrive &amp; unwind</h3>
              <p className="text-sm leading-relaxed">
                Bring your towel, water bottle and anything you need to feel comfortable. A volunteer host will welcome
                you.
              </p>
            </div>
            <div className="border-2 border-black p-4 space-y-3">
              <p className={typography.mono.label}>Step 4</p>
              <h3 className="font-display uppercase text-sm">Keep coming back</h3>
              <p className="text-sm leading-relaxed">
                Choose a membership or punch card that matches how often you want to come.
              </p>
              <button
                type="button"
                className={`${buttons.base} ${buttons.primary}`}
              >
                Active button
              </button>
              <button
                type="button"
                disabled
                className={`${buttons.base} ${buttons.primary}`}
              >
                Disabled (example)
              </button>
            </div>
          </div>
        </section>

        <div className={sections.divider} />

        {/* 4. Membership & pricing snapshot */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <p className={typography.mono.label}>Membership snapshot</p>
              <h2 className="font-display uppercase text-2xl">Find a rhythm that fits you</h2>
            </div>
            <Link href="/plans" className={`${interactive.link} text-sm`}>
              View all plans →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <article className="border-2 border-black p-4 space-y-2 bg-gray-100">
              <h3 className="font-display uppercase text-sm">Trial month</h3>
              <p className="text-sm leading-relaxed">
                Try the sauna for a month with unlimited credits so you can find your routine.
              </p>
              <p className={typography.mono.caption}>€0 • 1 month</p>
            </article>
            <article className="border-2 border-black p-4 space-y-2">
              <h3 className="font-display uppercase text-sm">4x a month</h3>
              <p className="text-sm leading-relaxed">
                A steady rhythm for regulars who want a weekly reset.
              </p>
              <p className={typography.mono.caption}>€40 • 4 credits / month</p>
            </article>
            <article className="border-2 border-black p-4 space-y-2">
              <h3 className="font-display uppercase text-sm">Unlimited</h3>
              <p className="text-sm leading-relaxed">
                For the true sauna lovers who want to drop in whenever there is space.
              </p>
              <p className={typography.mono.caption}>€80 • unlimited credits</p>
            </article>
            <article className="border-2 border-black p-4 space-y-2">
              <h3 className="font-display uppercase text-sm">Punch card 5x</h3>
              <p className="text-sm leading-relaxed">
                Flexible bundle you can use across several months, perfect if your weeks are irregular.
              </p>
              <p className={typography.mono.caption}>€75 • 5 total credits</p>
            </article>
          </div>
        </section>

        <div className={sections.divider} />

        {/* 5. Community & footer strip */}
        <section className="space-y-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr,1.4fr] gap-6 items-start">
            <div className="space-y-3">
              <h2 className="font-display uppercase text-2xl">Built and hosted together</h2>
              <p className="text-base leading-relaxed">
                Löyly runs on volunteers who host their own sessions — from quiet mornings to themed evenings. Our aim
                is to create a place where different bodies, ages and stories feel welcome.
              </p>
              <p className={`text-sm leading-relaxed ${colors.textSubtle}`}>
                Interested in hosting or supporting the project in another way? We would love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Link
                  href="/help"
                  className={`${buttons.base} ${buttons.secondary} w-full sm:w-auto text-center`}
                >
                  Read the Q&amp;A
                </Link>
                <a
                  href="mailto:info@example-sauna.local"
                  className={`${interactive.link} text-sm`}
                >
                  Email the organizers
                </a>
              </div>
            </div>

            <div className="border-2 border-black bg-gray-100 p-4 md:p-6 space-y-2 text-sm">
              <p className={typography.mono.label}>Where to find us</p>
              <p>Buiksloterweg • Amsterdam Noord</p>
              <p className={colors.textSubtle}>
                Exact address and practical details are shared after your first booking.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">
            <p>Buurtsauna Löyly — community sauna booking platform.</p>
            <p className={colors.textSubtle}>Built to be reusable for other communities.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
