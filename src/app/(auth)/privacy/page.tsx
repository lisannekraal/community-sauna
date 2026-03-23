import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { colors, interactive } from '@/lib/design-tokens';

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000';

export const metadata = {
  title: 'Privacy Policy — Löyly',
};

export default async function PrivacyPage() {
  const t = await getTranslations('Privacy');

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] px-6 py-12 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none mb-4">
          {t('title')}
        </h1>
        <p className={`font-mono text-xs ${colors.textSubtle}`}>
          {t('lastUpdated')}
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">
        <section>
          <h2 className="text-2xl mb-3">{t('whoWeAre.heading')}</h2>
          <p className={colors.textSubtle}>
            {t('whoWeAre.body')}{' '}
            <a href="mailto:info@buurtsaunaloyly.nl" className={interactive.link}>
              info@buurtsaunaloyly.nl
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">{t('whatData.heading')}</h2>
          <div className={`space-y-4 ${colors.textSubtle}`}>
            <div>
              <p className="font-medium text-black mb-1">{t('whatData.account.label')}</p>
              <p>{t('whatData.account.body')}</p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">{t('whatData.optional.label')}</p>
              <p>{t('whatData.optional.body')}</p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">{t('whatData.booking.label')}</p>
              <p>{t('whatData.booking.body')}</p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">{t('whatData.payment.label')}</p>
              <p>{t('whatData.payment.body')}</p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">{t('whatData.email.label')}</p>
              <p>{t('whatData.email.body')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl mb-3">{t('legalBasis.heading')}</h2>
          <p className={colors.textSubtle}>
            {t.rich('legalBasis.body', {
              contract: (chunks) => <strong className="text-black">{chunks}</strong>,
              consent: (chunks) => <strong className="text-black">{chunks}</strong>,
            })}
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">{t('retention.heading')}</h2>
          <p className={colors.textSubtle}>{t('retention.body')}</p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">{t('sharing.heading')}</h2>
          <div className={`space-y-3 ${colors.textSubtle}`}>
            <p>
              <strong className="text-black">Mollie</strong> — {t('sharing.mollie')}
            </p>
            <p>
              <strong className="text-black">Infomaniak</strong> — {t('sharing.infomaniak')}
            </p>
            <p>{t('sharing.noSale')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl mb-3">{t('cookies.heading')}</h2>
          <p className={colors.textSubtle}>{t('cookies.body')}</p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">{t('rights.heading')}</h2>
          <p className={`mb-3 ${colors.textSubtle}`}>{t('rights.intro')}</p>
          <ul className={`space-y-1 pl-4 ${colors.textSubtle}`}>
            <li>— {t('rights.access')}</li>
            <li>— {t('rights.correct')}</li>
            <li>— {t('rights.delete')}</li>
            <li>— {t('rights.portable')}</li>
            <li>— {t('rights.object')}</li>
          </ul>
          <p className={`mt-3 ${colors.textSubtle}`}>
            {t('rights.contact')}{' '}
            <a href="mailto:info@buurtsaunaloyly.nl" className={interactive.link}>
              info@buurtsaunaloyly.nl
            </a>
            . {t('rights.authority')}{' '}
            <a
              href="https://www.autoriteitpersoonsgegevens.nl"
              target="_blank"
              rel="noopener noreferrer"
              className={interactive.link}
            >
              Autoriteit Persoonsgegevens
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">{t('questions.heading')}</h2>
          <p className={colors.textSubtle}>
            {t('questions.body')}{' '}
            <a href="mailto:info@buurtsaunaloyly.nl" className={interactive.link}>
              info@buurtsaunaloyly.nl
            </a>
            .
          </p>
        </section>

        <div className="border-t-2 border-black pt-6">
          <Link href={LANDING_URL} className={`font-mono text-xs uppercase tracking-widest ${interactive.link}`}>
            {t('backToLoyly')}
          </Link>
        </div>
      </div>
    </div>
  );
}
