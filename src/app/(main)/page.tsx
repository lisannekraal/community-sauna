import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateISO, formatTimeUTC } from '@/lib/schedule';
import { type TimeSlotData } from '@/types';
import { buttons } from '@/lib/design-tokens';
import { Schedule } from '@/components/schedule/schedule';
import { getTranslations } from 'next-intl/server';
import { formatPrice, formatPeriod, formatSessions, formatDetail } from '@/lib/plans';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://app.localhost:3000';

export default async function HomePage() {
  const t = await getTranslations('Landing');

  const HOW_STEPS = [
    {
      number: '01',
      title: t('how.step1Title'),
      description: t('how.step1Desc'),
      cta: { label: t('how.step1Cta'), href: `${APP_URL}/register` },
    },
    {
      number: '02',
      title: t('how.step2Title'),
      description: t('how.step2Desc'),
      cta: { label: t('how.step2Cta'), href: '/#plans' },
    },
    {
      number: '03',
      title: t('how.step3Title'),
      description: t('how.step3Desc'),
      cta: null,
    },
    {
      number: '04',
      title: t('how.step4Title'),
      description: t('how.step4Desc'),
      cta: null,
    },
  ];

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
      <section className="min-h-[calc(100vh-3.5rem)] border-b border-ink flex flex-col">
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 max-w-7xl mx-auto w-full">

            <h1 className="font-display leading-none mb-8 text-[clamp(4rem,13vw,11rem)]">
              Löyly*
            </h1>

            <p className="text-xl md:text-2xl text-timber max-w-xl mb-10 leading-relaxed">
              {t('hero.subtitle').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={`${APP_URL}/register`}
                className={`${buttons.cta} ${buttons.ctaPrimary}`}
              >
                {t('hero.ctaBecomeMember')}
              </a>
              <a
                href="/#schedule"
                className={`${buttons.cta} ${buttons.ctaSecondary}`}
              >
                {t('hero.ctaSeeSchedule')}
              </a>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              *
              <span className="font-mono text-xs text-ash italic">löy·ly</span>
              <span className="font-mono text-xs text-ash">|ˈløy.ly|</span>
              <span className="font-mono text-xs text-ash uppercase tracking-wider">{t('hero.noun')}</span>
              <span className="font-mono text-xs text-ash">·</span>
              <span className="font-mono text-xs text-ash italic">{t('hero.origin')}</span>
              <span className="font-mono text-xs text-timber">— {t('hero.definition')}</span>
            </div>
          </div>
        </section>

        <section id="crowdfunding" className="bg-ink text-paper border-b border-ink">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <div className="inline-block border border-ash/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-8 text-ash">
                  {t('crowdfunding.badge')}
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,5vw,4rem)] mb-8">
                  {t('crowdfunding.heading')}
                </h2>
                <p className="text-ash text-lg leading-relaxed mb-10 max-w-lg">
                  {t('crowdfunding.body')}
                </p>
                <a
                  href="https://whydonate.com/fundraising/buurtsauna-loyly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttons.cta} ${buttons.ctaOnDark}`}
                >
                  {t('crowdfunding.cta')}
                </a>
              </div>

              {/* Image — replace with <Image> when photo is available */}
              <div className="border border-ash/30 min-h-[360px] flex items-center justify-center relative">
                <div className="text-center">
                  <div className="border border-ash/30 w-16 h-16 mx-auto flex items-center justify-center mb-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ash/40">
                      <rect x="3" y="3" width="18" height="18" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ash/40">{t('crowdfunding.imagePlaceholder')}</span>
                </div>
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-ash/30">
                  {t('crowdfunding.imageCaption')}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="border-b border-ink">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2">

              {/* Image — replace div with <Image> when photo is available */}
              <div className="border-b lg:border-b-0 lg:border-r border-ink min-h-[360px] lg:min-h-[560px] bg-paper relative flex items-center justify-center">
                <div className="text-center">
                  <div className="border border-ash w-16 h-16 mx-auto flex items-center justify-center mb-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ash">
                      <rect x="3" y="3" width="18" height="18" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ash">{t('about.imagePlaceholder')}</span>
                </div>
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-ash/60">
                  {t('about.imageCaption')}
                </span>
              </div>

              <div className="px-8 md:px-12 py-14 flex flex-col justify-center">
                <div className="inline-block border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-8 self-start text-ash">
                  {t('about.badge')}
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,5vw,4rem)] mb-8">
                  {t('about.heading').split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </h2>
                <p className="text-timber leading-relaxed mb-5">
                  {t('about.para1')}
                </p>
                <p className="text-timber leading-relaxed mb-10">
                  {t('about.para2')}
                </p>
                <a
                  href="/#crowdfunding"
                  className={`self-start ${buttons.cta} ${buttons.ctaPrimary}`}
                >
                  {t('about.cta')}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="border-b border-ink">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="mb-12">
              <div className="inline-block border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6 text-ash">
                {t('how.badge')}
              </div>
              <h2 className="font-display leading-none text-[clamp(2rem,6vw,4.5rem)]">
                {t('how.heading').split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className={`border border-ink p-6 flex flex-col bg-paper ${i % 2 !== 0 ? 'lg:mt-10' : ''}`}
                >
                  <div className="font-mono text-6xl font-bold text-ember/15 mb-4 leading-none select-none">
                    {step.number}
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">{step.title}</h3>
                  <p className="text-timber text-sm leading-relaxed flex-1">{step.description}</p>
                  {step.cta && (
                    <div className="mt-5 pt-4 border-t border-ink">
                      <a
                        href={step.cta.href}
                        className="font-mono text-[11px] uppercase tracking-widest text-ember hover:underline"
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

        <section id="plans" className="border-b border-ink">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-block border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6 text-ash">
                  {t('plans.badge')}
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,6vw,4.5rem)]">
                  {t('plans.heading').split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </h2>
              </div>
              <a href={`${APP_URL}/register`} className={buttons.ctaSmall}>
                {t('plans.cta')}
              </a>
            </div>

            {subscriptionPlans.length > 0 && (
              <>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ash mb-4">{t('plans.subscriptions')}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="border border-ink p-5 flex flex-col bg-paper">
                      <div className="font-display font-bold text-2xl leading-tight mb-3">{plan.name}</div>
                      <div className="font-mono text-2xl leading-none mb-1 text-ember">{formatPrice(plan.priceCents)}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest mb-5 text-ash pb-8">
                        {formatPeriod(plan)}
                      </div>
                      <div className="border-t border-ink/10 pt-4 mt-auto">
                        {/* <div className="font-mono text-[11px] font-bold mb-2">{formatSessions(plan)}</div> */}
                        <p className="text-xs leading-relaxed text-timber">{formatDetail(plan)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {punchCardPlans.length > 0 && (
              <>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ash mb-4">{t('plans.punchCards')}</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {punchCardPlans.map((plan) => (
                    <div key={plan.id} className="border border-ink p-5 bg-paper flex items-center justify-between gap-4">
                      <div>
                        <div className="font-display font-bold text-2xl">{plan.name}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ash mt-1">
                          {formatSessions(plan)} · {formatDetail(plan)}
                        </div>
                      </div>
                      <div className="font-mono text-2xl shrink-0 text-ember">{formatPrice(plan.priceCents)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </section>

        <section id="schedule" className="border-b border-ink">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-block border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6 text-ash">
                  {t('schedule.badge')}
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,6vw,4.5rem)]">
                  {t('schedule.heading')}
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

        <section id="contact" className="border-b border-ink">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink">

              <div className="px-8 md:px-10 pt-12 pb-20">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ash mb-5">{t('contact.locationLabel')}</div>
                <h3 className="font-display text-3xl mb-5">{t('contact.locationHeading')}</h3>
                <p className="text-ash text-xs mt-4 font-mono">
                  {t('contact.locationNote')}
                </p>
              </div>

              <div className="px-8 md:px-10 pt-12 pb-20">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ash mb-5">{t('contact.contactLabel')}</div>
                <h3 className="font-display text-3xl mb-5">{t('contact.contactHeading')}</h3>
                <p className="text-sm text-timber mb-2">
                  <a href="mailto:info@buurtsaunaloyly.nl" className="text-ember underline hover:no-underline">
                    info@buurtsaunaloyly.nl
                  </a>
                </p>
              </div>

              <div className="px-8 md:px-10 pt-12 pb-20">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ash mb-5">{t('contact.hoursLabel')}</div>
                <h3 className="font-display text-3xl mb-5">{t('contact.hoursHeading')}</h3>
                <p className="text-ash text-xs mt-5 font-mono">
                  {t('contact.hoursNote')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-ink">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="font-display text-[25px]">Löyly</Link>
            <div className="flex items-center gap-6">
              <a href={`${APP_URL}/login`} className="font-mono text-[11px] uppercase tracking-widest text-timber hover:underline">
                {t('footer.memberLogin')}
              </a>
              <a href={`${APP_URL}/register`} className="font-mono text-[11px] uppercase tracking-widest text-timber hover:underline">
                {t('footer.preRegister')}
              </a>
              <a href={`${APP_URL}/privacy`} className="font-mono text-[11px] uppercase tracking-widest text-timber hover:underline">
                {t('footer.privacy')}
              </a>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ash">
              {t('footer.copyright')}
            </span>
          </div>
        </footer>
    </>
  );
}
