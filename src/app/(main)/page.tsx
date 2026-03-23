import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateISO, formatTimeUTC } from '@/lib/schedule';
import { type TimeSlotData } from '@/types';
import { buttons } from '@/lib/design-tokens';
import { Schedule } from '@/components/schedule/schedule';

import { formatPrice, formatPeriod, formatSessions, formatDetail } from '@/lib/plans';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://app.localhost:3000';

const HOW_STEPS = [
  {
    number: '01',
    title: 'Pre-register',
    description: 'Create an account to join our community.',
    cta: { label: 'Pre-register now →', href: `${APP_URL}/register` },
  },
  {
    number: '02',
    title: 'Choose a plan',
    description: 'When we reveal our start date, pick your membership or punch card.',
    cta: { label: 'Preview plans →', href: '/#plans'},
  },
  {
    number: '03',
    title: 'Book a slot',
    description: 'Browse the schedule and book your spot. The address is shared upon confirmation.',
    cta: null,
  },
  {
    number: '04',
    title: 'Get involved',
    description: 'Become a host or contribute in other ways.',
    cta: null,
  },
];

export default async function HomePage() {
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: [{ type: 'asc' }, { priceCents: 'asc' }],
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      priceCents: true,
      creditsPerMonth: true,
      totalCredits: true,
      validityMonths: true,
      minimumCommitmentMonths: true,
    },
  });

  const subscriptionPlans = plans.filter((p) => p.type === 'subscription');
  const punchCardPlans = plans.filter((p) => p.type === 'punch_card');

  const slots = await prisma.timeSlot.findMany({
    //TODO: a where clause for a time limit 
    // when time slots get too many in production 
    // (also in the other schedule)
    include: {
      _count: { select: { bookings: { where: { status: 'confirmed' } } } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  const timeSlots: TimeSlotData[] = slots.map((slot) => ({
    id: slot.id,
    date: formatDateISO(slot.date),
    startTime: formatTimeUTC(slot.startTime),
    endTime: formatTimeUTC(slot.endTime),
    capacity: slot.capacity,
    bookedCount: slot._count.bookings,
    type: slot.type,
    description: slot.description,
    isCancelled: slot.isCancelled,
  }));

  return (
    <>
      <section className="min-h-[calc(100vh-3.5rem)] border-b-2 border-black flex flex-col">
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 max-w-7xl mx-auto w-full">

            <h1 className="font-display leading-none mb-8 text-[clamp(4rem,13vw,11rem)]">
              Löyly*
            </h1>

            <p className="text-xl md:text-2xl text-black/55 max-w-xl mb-10 leading-relaxed">
              A community-run sauna<br />
              in Amsterdam Noord
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={`${APP_URL}/register`}
                className={`${buttons.cta} ${buttons.ctaPrimary}`}
              >
                Become a member&nbsp;→
              </a>
              <a
                href="/#schedule"
                className={`${buttons.cta} ${buttons.ctaSecondary}`}
              >
                See the schedule
              </a>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              *
              <span className="font-mono text-xs text-black/35 italic">löy·ly</span>
              <span className="font-mono text-xs text-black/25">|ˈløy.ly|</span>
              <span className="font-mono text-xs text-black/25 uppercase tracking-wider">noun</span>
              <span className="font-mono text-xs text-black/25">·</span>
              <span className="font-mono text-xs text-black/25 italic">Finnish</span>
              <span className="font-mono text-xs text-black/50">— the steam of the sauna</span>
            </div>
          </div>
        </section>

        <section id="crowdfunding" className="bg-black text-white border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <div className="inline-block border-2 border-white/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-8">
                  Crowdfunding
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,5vw,4rem)] mb-8">
                  A sauna for the neighborhood
                </h2>
                <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-lg">
                  We&apos;re raising funds to make this community sauna happen. You can pre-buy punch cards or become an early member right away.
                </p>
                <a
                  href="https://whydonate.com/fundraising/buurtsauna-loyly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttons.cta} ${buttons.ctaOnDark}`}
                >
                  Support Löyly&nbsp;→
                </a>
              </div>

              {/* Image — replace with <Image> when photo is available */}
              <div className="border-2 border-white/30 min-h-[360px] flex items-center justify-center relative">
                <div className="text-center">
                  <div className="border-2 border-white/30 w-16 h-16 mx-auto flex items-center justify-center mb-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                      <rect x="3" y="3" width="18" height="18" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Photo</span>
                </div>
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-white/20">
                  Crowdfunding campaign image
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="border-b-2 border-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2">

              {/* Image — replace div with <Image> when photo is available */}
              <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-black min-h-[360px] lg:min-h-[560px] bg-gray-100 relative flex items-center justify-center">
                <div className="text-center">
                  <div className="border-2 border-gray-300 w-16 h-16 mx-auto flex items-center justify-center mb-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                      <rect x="3" y="3" width="18" height="18" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Photo</span>
                </div>
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-gray-300">
                  Community sauna interior
                </span>
              </div>

              <div className="px-8 md:px-12 py-14 flex flex-col justify-center">
                <div className="inline-block border-2 border-black px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-8 self-start">
                  About us
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,5vw,4rem)] mb-8">
                  Building<br />our dream
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Löyly is a member-run sauna. 
                  We believe sauna should be accessible to everyone — a place to unwind, connect with neighbors, and care for your body and mind. 
                  That's why we're building an affordable, community-run sauna in Amsterdam Noord, hosted by volunteers.
                </p>
                <p className="text-gray-600 leading-relaxed mb-10">
                  We're converting a container at 't Keerwater on the Buiksloterweg into a full sauna, shower, and changing room.
                  The structure is up, insulation is in, and our second-hand sauna is custom-fitted and ready. 
                  We're now in the final stretch — flooring, tiling, and finishing touches. Want to be part of it?
                </p>
                <a
                  href="/#crowdfunding"
                  className={`self-start ${buttons.cta} ${buttons.ctaPrimary}`}
                >
                  Crowdfunding&nbsp;→
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="border-b-2 border-black bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="mb-12">
              <div className="inline-block border-2 border-black px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6">
                How it works
              </div>
              <h2 className="font-display leading-none text-[clamp(2rem,6vw,4.5rem)]">
                When Löyly<br />opens
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className={`border-2 border-black p-6 flex flex-col bg-white ${i % 2 !== 0 ? 'lg:mt-10' : ''}`}
                >
                  <div className="font-mono text-6xl font-bold text-black/8 mb-4 leading-none select-none">
                    {step.number}
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{step.description}</p>
                  {step.cta && (
                    <div className="mt-5 pt-4 border-t-2 border-black">
                      <a
                        href={step.cta.href}
                        className="font-mono text-[11px] uppercase tracking-widest hover:underline"
                      >
                        {step.cta.label}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="plans" className="border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-block border-2 border-black px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6">
                  Memberships
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,6vw,4.5rem)]">
                  Choose<br />your rhythm
                </h2>
              </div>
              <a href={`${APP_URL}/register`} className={buttons.ctaSmall}>
                Pre-register&nbsp;→
              </a>
            </div>

            {subscriptionPlans.length > 0 && (
              <>
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/35 mb-4">Subscriptions</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="border-2 border-black p-5 flex flex-col bg-white">
                      <div className="font-display font-bold text-2xl leading-tight mb-3">{plan.name}</div>
                      <div className="font-mono text-2xl leading-none mb-1">{formatPrice(plan.priceCents)}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest mb-5 text-black/35 pb-8">
                        {formatPeriod(plan)}
                      </div>
                      <div className="border-t border-black/10 pt-4 mt-auto">
                        {/* <div className="font-mono text-[11px] font-bold mb-2">{formatSessions(plan)}</div> */}
                        <p className="text-xs leading-relaxed text-gray-500">{formatDetail(plan)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {punchCardPlans.length > 0 && (
              <>
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/35 mb-4">Punch cards</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {punchCardPlans.map((plan) => (
                    <div key={plan.id} className="border-2 border-black p-5 bg-white flex items-center justify-between gap-4">
                      <div>
                        <div className="font-display font-bold text-2xl">{plan.name}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-black/40 mt-1">
                          {formatSessions(plan)} · {formatDetail(plan)}
                        </div>
                      </div>
                      <div className="font-mono text-2xl shrink-0">{formatPrice(plan.priceCents)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </section>

        <section id="schedule" className="border-b-2 border-black bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-block border-2 border-black px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6">
                  Bookings
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,6vw,4.5rem)]">
                  Löyly schedule
                </h2>
              </div>
              {/* <Link
                href="/login"
                className="border-2 border-black px-6 py-3 font-mono text-[11px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
              >
                Login to book&nbsp;→
              </Link> */}
            </div>
            <Schedule timeSlots={timeSlots} userBookings={{}} />
          </div>
        </section>

        <section id="contact" className="border-b-2 border-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">

              <div className="px-8 md:px-10 pt-12 pb-20">
                <div className="font-mono text-[10px] uppercase tracking-widest text-black/40 mb-5">Location</div>
                <h3 className="font-display text-3xl mb-5">Amsterdam Noord</h3>
                <p className="text-gray-400 text-xs mt-4 font-mono">
                  Exact address shared upon booking confirmation.
                </p>
              </div>

              <div className="px-8 md:px-10 pt-12 pb-20">
                <div className="font-mono text-[10px] uppercase tracking-widest text-black/40 mb-5">Contact us</div>
                <h3 className="font-display text-3xl mb-5">Camille en Barnaby</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <a href="mailto:info@buurtsaunaloyly.nl" className="underline hover:no-underline">
                    info@buurtsaunaloyly.nl
                  </a>
                </p>
              </div>

              <div className="px-8 md:px-10 pt-12 pb-20">
                <div className="font-mono text-[10px] uppercase tracking-widest text-black/40 mb-5">Hours</div>
                <h3 className="font-display text-3xl mb-5">To be announced</h3>
                <p className="text-gray-400 text-xs mt-5 font-mono">
                  Stay tuned for our schedule.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="font-display text-[25px]">Löyly</Link>
            <div className="flex items-center gap-6">
              <a href={`${APP_URL}/login`} className="font-mono text-[11px] uppercase tracking-widest hover:underline">
                Member login
              </a>
              <a href={`${APP_URL}/register`} className="font-mono text-[11px] uppercase tracking-widest hover:underline">
                Pre-register
              </a>
              <a href={`${APP_URL}/privacy`} className="font-mono text-[11px] uppercase tracking-widest hover:underline">
                Privacy
              </a>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-black/30">
              © 2026 Löyly
            </span>
          </div>
        </footer>
    </>
  );
}
