import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateISO, formatTimeUTC } from '@/lib/schedule';
import { type TimeSlotData } from '@/types';
import { buttons } from '@/lib/design-tokens';
import { Schedule } from '@/components/schedule/schedule';
import { getTranslations } from 'next-intl/server';
import { PlanCard } from '@/components/plans/plan-card';

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
      autoRenew: true,
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
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col">
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
                {t('hero.ctaPreRegister')}
              </a>
              <a
                href="/#how"
                className={`${buttons.cta} ${buttons.ctaSecondary}`}
              >
                {t('hero.ctaHowItWorks')}
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

        <section id="crowdfunding" className="bg-forest-green text-paper">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2">

              <div className="px-8 md:px-12 py-22">
                <div className="inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-8 text-paper">
                  {t('crowdfunding.badge')}
                </div>
                <h2 className="font-display leading-none text-[clamp(2rem,5vw,4rem)] mb-8">
                  {t('crowdfunding.heading')}
                </h2>
                <p className="text-paper text-lg leading-relaxed mb-10 max-w-lg">
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

              <div className="min-h-[360px] relative overflow-hidden order-first lg:order-last">
                <Image
                  src="/images/crowdfunding.jpg"
                  alt={t('crowdfunding.imageAlt')}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="border-b border-mustard-gold">
          <div className="max-w-7xl mx-auto px-8 md:px-12 py-22">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <div className="relative overflow-hidden min-h-[360px] h-full">
                <Image
                  src="/images/about.avif"
                  alt={t('about.imageAlt')}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="inline-block border border-mustard-gold px-3 font-mono text-[10px] uppercase tracking-widest mb-8 self-start text-ash">
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

        <section id="how" className="border-b border-mustard-gold">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="mb-12">
              <div className="inline-block border border-mustard-gold px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6 text-ash">
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
                  className={`border border-mustard-gold p-6 flex flex-col bg-paper ${i % 2 !== 0 ? 'lg:mt-10' : ''}`}
                >
                  <div className="font-mono text-6xl font-bold text-mustard-gold/15 mb-4 leading-none select-none">
                    {step.number}
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">{step.title}</h3>
                  <p className="text-timber text-sm leading-relaxed flex-1">{step.description}</p>
                  {step.cta && (
                    <div className="mt-5 pt-4 border-t border-mustard-gold">
                      <a
                        href={step.cta.href}
                        className="font-mono text-[11px] uppercase tracking-widest hover:opacity-60"
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

        <section id="plans" className="border-b border-mustard-gold">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-block border border-mustard-gold px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6 text-ash">
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
                    <PlanCard key={plan.id} plan={plan} variant="display" />
                  ))}
                </div>
              </>
            )}

            {punchCardPlans.length > 0 && (
              <>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ash mb-4">{t('plans.punchCards')}</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {punchCardPlans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} variant="display" />
                  ))}
                </div>
              </>
            )}

          </div>
        </section>

        <section id="schedule" className="border-b border-mustard-gold">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-block border border-mustard-gold px-3 py-1 font-mono text-[10px] uppercase tracking-widest mb-6 text-ash">
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

        <section id="contact">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-mustard-gold">

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
                  <a href="mailto:info@buurtsaunaloyly.nl" className="text-mustard-gold underline hover:no-underline">
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

        <footer className="border-t border-mustard-gold">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="font-display text-[25px]">Löyly</Link>
            <div className="flex items-center gap-6">
              <a href={`${APP_URL}/login`} className="font-mono text-[11px] uppercase tracking-widest text-timber hover:opacity-60">
                {t('footer.memberLogin')}
              </a>
              <a href={`${APP_URL}/register`} className="font-mono text-[11px] uppercase tracking-widest text-timber hover:opacity-60">
                {t('footer.preRegister')}
              </a>
              <a href={`${APP_URL}/privacy`} className="font-mono text-[11px] uppercase tracking-widest text-timber hover:opacity-60">
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
