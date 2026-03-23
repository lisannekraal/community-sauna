import Link from 'next/link';
import { colors, interactive } from '@/lib/design-tokens';

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000';

export const metadata = {
  title: 'Privacy Policy — Löyly',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100dvh-3.5rem)] px-6 py-12 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none mb-4">
          Privacy Policy
        </h1>
        <p className={`font-mono text-xs ${colors.textSubtle}`}>
          Last updated: March 2026
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">
        <section>
          <h2 className="text-2xl mb-3">Who we are</h2>
          <p className={colors.textSubtle}>
            Buurtsauna Löyly is a community sauna located in Amsterdam Noord. We operate this
            booking platform to allow members to reserve time slots and manage their membership.
            You can reach us at{' '}
            <a href="mailto:info@buurtsaunaloyly.nl" className={interactive.link}>
              info@buurtsaunaloyly.nl
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">What data we collect and why</h2>
          <div className={`space-y-4 ${colors.textSubtle}`}>
            <div>
              <p className="font-medium text-black mb-1">Account information</p>
              <p>
                When you register, we collect your email address, password (stored as a
                one-way hash), first name, and phone number. These are required to create
                your account and identify you as a member.
              </p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">Optional profile data</p>
              <p>
                Last name, gender, and emergency contact details (name and phone number) are
                optional. Emergency contact information is used only in the event of a medical
                situation during a session.
              </p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">Booking data</p>
              <p>
                We record which time slots you book and any cancellation reasons you provide.
                This is necessary to manage capacity and your membership credits.
              </p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">Payment data</p>
              <p>
                Payments are processed by Mollie. We store the status and history of your
                payments (success, failure, pending) but do not store your card or bank
                details — those are handled exclusively by Mollie.
              </p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">Transactional emails</p>
              <p>
                We send emails for booking confirmations, password resets, and membership
                renewal reminders. We do not send marketing emails.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl mb-3">Legal basis</h2>
          <p className={colors.textSubtle}>
            We process your data on the basis of <strong className="text-black">contract</strong> —
            it is necessary to operate your membership and fulfil bookings. Emergency contact
            data is processed on the basis of your <strong className="text-black">consent</strong>,
            which you can withdraw by removing it from your profile.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">How long we keep your data</h2>
          <p className={colors.textSubtle}>
            We keep your account and booking history for as long as your membership is active.
            If you delete your account, your personal data is removed. Payment records may be
            retained for up to 7 years to meet Dutch bookkeeping requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">Who we share your data with</h2>
          <div className={`space-y-3 ${colors.textSubtle}`}>
            <p>
              <strong className="text-black">Mollie</strong> — our payment provider.
              Mollie processes payment transactions and is subject to their own privacy policy.
            </p>
            <p>
              <strong className="text-black">Infomaniak</strong> — our hosting and email
              provider, based in Switzerland. Your data is stored on their servers and
              emails are sent through their mail service.
            </p>
            <p>
              We do not sell your data or share it with any other third parties.
              Admins and hosts can see the member information needed to manage sessions
              (name, contact details for their sessions).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl mb-3">Cookies</h2>
          <p className={colors.textSubtle}>
            This platform uses a single session cookie to keep you logged in. This cookie is
            strictly necessary for the service to function and does not require your consent.
            We do not use analytics, advertising, or any other third-party cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-3">Your rights</h2>
          <p className={`mb-3 ${colors.textSubtle}`}>
            Under the GDPR (AVG), you have the right to:
          </p>
          <ul className={`space-y-1 pl-4 ${colors.textSubtle}`}>
            <li>— Access the personal data we hold about you</li>
            <li>— Correct inaccurate data</li>
            <li>— Request deletion of your data</li>
            <li>— Receive your data in a portable format</li>
            <li>— Object to processing based on legitimate interest</li>
          </ul>
          <p className={`mt-3 ${colors.textSubtle}`}>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:info@buurtsaunaloyly.nl" className={interactive.link}>
              info@buurtsaunaloyly.nl
            </a>
            . You also have the right to lodge a complaint with the{' '}
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
          <h2 className="text-2xl mb-3">Questions</h2>
          <p className={colors.textSubtle}>
            If you have any questions about this privacy policy, contact us at{' '}
            <a href="mailto:info@buurtsaunaloyly.nl" className={interactive.link}>
              info@buurtsaunaloyly.nl
            </a>
            .
          </p>
        </section>

        <div className={`border-t-2 border-black pt-6`}>
          <Link href={LANDING_URL} className={`font-mono text-xs uppercase tracking-widest ${interactive.link}`}>
            ← Back to Löyly
          </Link>
        </div>
      </div>
    </div>
  );
}
