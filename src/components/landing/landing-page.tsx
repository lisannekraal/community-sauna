import Link from 'next/link';
import { FireFlame, Group, Heart, Leaf, Clock, MapPin, ArrowRight, Community } from 'iconoir-react';

// ─── Reusable button variants for this landing page ───────────────────────────

function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block bg-loly-ember text-white border-2 border-loly-ember hover:bg-loly-ember-dark hover:border-loly-ember-dark active:scale-95 transition-all px-7 py-3 font-loly-heading uppercase tracking-wider text-sm"
    >
      {children}
    </Link>
  );
}

function BtnSecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block bg-transparent text-loly-cream border-2 border-loly-cream hover:bg-loly-cream hover:text-loly-wood active:scale-95 transition-all px-7 py-3 font-loly-heading uppercase tracking-wider text-sm"
    >
      {children}
    </Link>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ width: number; height: number; strokeWidth?: number }>;
  title: string;
  description: string;
}) {
  return (
    <div className="border-2 border-loly-birch bg-loly-cream p-7 flex flex-col items-center text-center group hover:border-loly-ember transition-colors">
      <div className="w-12 h-12 flex items-center justify-center border-2 border-loly-birch group-hover:border-loly-ember group-hover:text-loly-ember text-loly-stone transition-colors mb-5">
        <Icon width={22} height={22} strokeWidth={1.5} />
      </div>
      <h3 className="font-loly-heading text-loly-wood uppercase text-xs tracking-[0.2em] mb-3">{title}</h3>
      <p className="font-loly-body text-loly-stone text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Mock session tile ────────────────────────────────────────────────────────

function SessionTile({
  day,
  date,
  time,
  type,
  spots,
  total,
}: {
  day: string;
  date: string;
  time: string;
  type: string;
  spots: number;
  total: number;
}) {
  return (
    <div className="border border-loly-birch/25 bg-loly-cream/8 p-5 flex items-center justify-between gap-4 hover:bg-loly-cream/15 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-loly-heading text-loly-ember uppercase text-xs tracking-widest mb-1">
          {day} {date}
        </p>
        <p className="font-loly-body text-loly-cream text-lg leading-tight">{time}</p>
        <p className="font-loly-body text-loly-stone text-sm mt-1">{type}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="flex items-center justify-end gap-1.5 mb-1">
          <div className="flex gap-0.5">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i < spots ? 'bg-loly-ember' : 'bg-loly-birch/30'}`}
              />
            ))}
          </div>
        </div>
        <p className="font-loly-heading text-loly-ember text-xs uppercase tracking-wider">
          {spots} plek{spots !== 1 ? 'ken' : ''}
        </p>
        <p className="font-loly-body text-loly-stone text-xs">van {total}</p>
      </div>
    </div>
  );
}

// ─── Pricing card ─────────────────────────────────────────────────────────────

function PricingCard({
  name,
  price,
  unit,
  tagline,
  description,
  featured = false,
  disabled = false,
}: {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  description: string;
  featured?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={`border-2 p-6 flex flex-col relative ${featured ? 'border-loly-ember' : 'border-loly-birch'}`}>
      {featured && (
        <span className="absolute -top-3.5 left-4 bg-loly-ember text-white font-loly-heading text-xs px-3 py-0.5 uppercase tracking-widest">
          Populair
        </span>
      )}
      <div className="flex-1">
        <h3 className="font-loly-heading text-loly-wood uppercase text-xs tracking-[0.15em] mb-3">{name}</h3>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-loly-logo text-4xl text-loly-wood">{price}</span>
        </div>
        <p className="font-loly-body text-loly-stone text-sm mb-1">{unit}</p>
        <p className="font-loly-body text-loly-ember text-xs font-medium mb-4">{tagline}</p>
        <p className="font-loly-body text-loly-stone text-sm leading-relaxed mb-6">{description}</p>
      </div>
      {disabled ? (
        <button
          disabled
          className="w-full bg-loly-birch text-loly-stone border-2 border-loly-birch cursor-not-allowed px-4 py-2.5 font-loly-heading uppercase tracking-wider text-xs opacity-60"
        >
          Binnenkort
        </button>
      ) : featured ? (
        <Link
          href="/register"
          className="block text-center bg-loly-ember text-white border-2 border-loly-ember hover:bg-loly-ember-dark hover:border-loly-ember-dark active:scale-95 transition-all px-4 py-2.5 font-loly-heading uppercase tracking-wider text-xs"
        >
          Start nu
        </Link>
      ) : (
        <Link
          href="/register"
          className="block text-center bg-transparent text-loly-wood border-2 border-loly-wood hover:bg-loly-wood hover:text-loly-cream active:scale-95 transition-all px-4 py-2.5 font-loly-heading uppercase tracking-wider text-xs"
        >
          Aanmelden
        </Link>
      )}
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="font-loly-body">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-loly-wood flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Subtle texture lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #D9C4A8 40px, #D9C4A8 41px)',
          }}
        />

        <div className="relative z-10 text-center max-w-4xl">
          <p className="font-loly-heading text-loly-ember text-xs uppercase tracking-[0.4em] mb-10">
            Amsterdam Noord
          </p>

          <div className="mb-4">
            <h1 className="font-loly-logo text-loly-cream leading-[0.9] text-[clamp(3.5rem,12vw,9rem)]">
              Buurtsauna
            </h1>
            <h1 className="font-loly-logo text-loly-ember leading-[0.9] text-[clamp(3.5rem,12vw,9rem)]">
              Löyly
            </h1>
          </div>

          <div className="flex items-center justify-center gap-4 my-10">
            <div className="h-px w-16 bg-loly-birch/30" />
            <p className="font-loly-body italic text-loly-birch text-base md:text-lg text-center max-w-sm">
              Een gemeenschappelijke sauna voor onze buurt
            </p>
            <div className="h-px w-16 bg-loly-birch/30" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BtnPrimary href="/schedule">Boek een sessie</BtnPrimary>
            <BtnSecondary href="#verhaal">Ons verhaal</BtnSecondary>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-loly-birch/20" />
          <p className="font-loly-heading text-loly-birch/30 text-xs tracking-[0.3em] uppercase">Scroll</p>
        </div>
      </section>

      {/* ── 2. HET VERHAAL ──────────────────────────────────────────────── */}
      <section id="verhaal" className="bg-loly-cream py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-loly-heading text-loly-ember text-xs uppercase tracking-[0.35em] mb-3">
            Het Verhaal
          </p>
          <h2 className="font-loly-heading text-loly-wood text-4xl md:text-5xl uppercase mb-16 leading-tight">
            Een droom uit de buurt
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <blockquote className="font-loly-body italic text-2xl md:text-3xl text-loly-wood leading-relaxed mb-8 border-l-4 border-loly-ember pl-7">
                &ldquo;Sauna is een plek voor mensen om samen te komen, te kletsen en samen te ontspannen — mentaal en fysiek.&rdquo;
              </blockquote>
              <p className="font-loly-body text-loly-stone text-base leading-relaxed mb-5">
                Wij zijn Barnaby en Camille — wij wonen met onze twee dochters in de van der Pekbuurt in Amsterdam Noord. Naast onze liefde voor de buurt en gemeenschapsvorming delen we ook onze liefde voor... Finse sauna.
              </p>
              <p className="font-loly-body text-loly-stone text-base leading-relaxed">
                Uit die drie dingen ontstond het idee: een sauna opzetten in onze buurt. Betaalbaar. Voor iedereen. Gerund door vrijwilligers uit de buurt.
              </p>
            </div>

            <div className="space-y-5">
              <div className="border-2 border-loly-birch bg-loly-steam p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin width={16} height={16} strokeWidth={1.5} className="text-loly-ember shrink-0" />
                  <h3 className="font-loly-heading text-loly-wood uppercase text-xs tracking-[0.2em]">De Plek</h3>
                </div>
                <p className="font-loly-body text-loly-stone text-sm leading-relaxed">
                  &lsquo;t Keerwater op de Buiksloterweg — een community van bijzondere ondernemers. De sauna is gebouwd in een omgebouwde container, midden in Amsterdam Noord.
                </p>
              </div>

              <div className="border-2 border-loly-birch bg-loly-steam p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Community width={16} height={16} strokeWidth={1.5} className="text-loly-ember shrink-0" />
                  <h3 className="font-loly-heading text-loly-wood uppercase text-xs tracking-[0.2em]">De Gemeenschap</h3>
                </div>
                <p className="font-loly-body text-loly-stone text-sm leading-relaxed">
                  Vrijwilligers uit de buurt draaien hun eigen tijdslot van drie uur. Ze geven er hun eigen draai aan — van geleide meditaties tot tijdsloten voor vrouwen en non-binaire mensen.
                </p>
              </div>

              <div className="border-2 border-loly-birch bg-loly-steam p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Heart width={16} height={16} strokeWidth={1.5} className="text-loly-ember shrink-0" />
                  <h3 className="font-loly-heading text-loly-wood uppercase text-xs tracking-[0.2em]">De Visie</h3>
                </div>
                <p className="font-loly-body text-loly-stone text-sm leading-relaxed">
                  Sauna zou voor iedereen regelmatig beschikbaar moeten zijn. Laagdrempelig en betaalbaar. Een plek waar iedereen zich welkom voelt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DE SAUNA ERVARING ────────────────────────────────────────── */}
      <section className="bg-loly-steam py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-loly-heading text-loly-ember text-xs uppercase tracking-[0.35em] mb-3 text-center">
            De Ervaring
          </p>
          <h2 className="font-loly-heading text-loly-wood text-4xl md:text-5xl uppercase text-center mb-16 leading-tight">
            Wat je kunt verwachten
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={FireFlame}
              title="Authentiek Fins"
              description="Een echte Finse sauna op hoge temperatuur, tweedehands maar gemaakt voor de lange termijn."
            />
            <FeatureCard
              icon={Group}
              title="Gemeenschap"
              description="Samen zweten, kletsen en je buren beter leren kennen. Dat is de kern van Löyly."
            />
            <FeatureCard
              icon={Heart}
              title="Voor Iedereen"
              description="Betaalbaar en laagdrempelig, met speciale tijdsloten voor vrouwen en non-binaire mensen."
            />
            <FeatureCard
              icon={Leaf}
              title="Vrijwilligers"
              description="Elke sessie gehosted door een vrijwilliger uit de buurt, met hun eigen draai."
            />
          </div>
        </div>
      </section>

      {/* ── 4. AANKOMENDE SESSIES ───────────────────────────────────────── */}
      <section className="bg-loly-wood py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-loly-heading text-loly-ember text-xs uppercase tracking-[0.35em] mb-3">
            Aankomende Sessies
          </p>
          <h2 className="font-loly-heading text-loly-cream text-4xl md:text-5xl uppercase mb-12 leading-tight">
            Plan je bezoek
          </h2>

          <div className="space-y-3 mb-10">
            <SessionTile
              day="Vr"
              date="6 Mrt"
              time="19:00 – 22:00"
              type="Reguliere sessie"
              spots={2}
              total={5}
            />
            <SessionTile
              day="Za"
              date="7 Mrt"
              time="13:00 – 16:00"
              type="Vrouwen & non-binair"
              spots={4}
              total={5}
            />
            <SessionTile
              day="Za"
              date="7 Mrt"
              time="19:00 – 22:00"
              type="Reguliere sessie"
              spots={5}
              total={5}
            />
            <SessionTile
              day="Zo"
              date="8 Mrt"
              time="15:00 – 18:00"
              type="Meditatie sessie"
              spots={3}
              total={5}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2.5 font-loly-heading text-loly-cream border-2 border-loly-cream hover:bg-loly-cream hover:text-loly-wood active:scale-95 transition-all px-7 py-3 uppercase tracking-wider text-sm"
            >
              Volledig schema
              <ArrowRight width={16} height={16} />
            </Link>
            <div className="flex items-center gap-2 text-loly-stone font-loly-body text-sm pt-3 sm:pt-0 sm:self-center">
              <Clock width={14} height={14} />
              Sessies duren 3 uur
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. LIDMAATSCHAP ─────────────────────────────────────────────── */}
      <section className="bg-loly-cream py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-loly-heading text-loly-ember text-xs uppercase tracking-[0.35em] mb-3">
            Lidmaatschap
          </p>
          <h2 className="font-loly-heading text-loly-wood text-4xl md:text-5xl uppercase mb-4 leading-tight">
            Word lid
          </h2>
          <p className="font-loly-body text-loly-stone text-lg mb-14 max-w-xl leading-relaxed">
            Kies het abonnement dat bij jou past. Betaalbaar voor iedereen.
          </p>

          {/* Button styles showcase */}
          <div className="border-2 border-loly-birch bg-loly-steam p-6 mb-14">
            <p className="font-loly-heading text-loly-stone text-xs uppercase tracking-[0.2em] mb-5">
              Button stijlen
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-loly-ember text-white border-2 border-loly-ember hover:bg-loly-ember-dark hover:border-loly-ember-dark active:scale-95 transition-all px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs">
                Primair
              </button>
              <button className="bg-transparent text-loly-wood border-2 border-loly-wood hover:bg-loly-wood hover:text-loly-cream active:scale-95 transition-all px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs">
                Secundair
              </button>
              <button className="bg-transparent text-loly-ember border-2 border-loly-ember hover:bg-loly-ember hover:text-white active:scale-95 transition-all px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs">
                Accent
              </button>
              <button
                disabled
                className="bg-loly-birch/50 text-loly-stone border-2 border-loly-birch cursor-not-allowed px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs opacity-60"
              >
                Uitgeschakeld
              </button>
              <button
                disabled
                className="inline-flex items-center gap-2 bg-loly-ember/70 text-white border-2 border-loly-ember/70 cursor-wait px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs"
              >
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Laden
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <PricingCard
              name="Walk-in"
              price="€16"
              unit="per sessie"
              tagline="Geen abonnement nodig"
              description="Spontaan langskomen zonder verplichting. Betaal per bezoek."
            />
            <PricingCard
              name="Strippenkaart 5×"
              price="€75"
              unit="3 mnd geldig"
              tagline="€15 per bezoek"
              description="5 beurten, 3 maanden geldig. Lekker flexibel."
            />
            <PricingCard
              name="Maandelijks 4×"
              price="€40"
              unit="per maand"
              tagline="€10 per bezoek"
              description="4 sessies per maand. Minimaal 2 maanden."
              featured
            />
            <PricingCard
              name="Onbeperkt"
              price="€80"
              unit="per maand"
              tagline="Sauna wanneer je wil"
              description="Onbeperkt sauna-en. Minimaal 1 maand."
            />
          </div>

          <p className="font-loly-body text-loly-stone text-sm mt-8 text-center">
            Vragen over lidmaatschap?{' '}
            <Link href="/help" className="text-loly-ember hover:text-loly-ember-dark underline hover:no-underline transition-colors">
              Bekijk de FAQ
            </Link>
          </p>
        </div>
      </section>

      {/* ── 6. MEEDOEN / FOOTER ─────────────────────────────────────────── */}
      <section className="bg-loly-ember py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-loly-heading text-white/60 text-xs uppercase tracking-[0.4em] mb-6">
            Buurtsauna Löyly
          </p>
          <h2 className="font-loly-logo text-white leading-none uppercase text-[clamp(3rem,10vw,7rem)] mb-4">
            Kom zweten.
          </h2>
          <p className="font-loly-body italic text-white/75 text-xl mb-14">
            &ldquo;Löyly — de stoom die vrijkomt als je water giet over de hete stenen&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/register"
              className="inline-block bg-white text-loly-ember border-2 border-white hover:bg-loly-cream hover:border-loly-cream active:scale-95 transition-all px-9 py-3.5 font-loly-heading uppercase tracking-wider text-sm"
            >
              Word lid
            </Link>
            <Link
              href="/schedule"
              className="inline-block bg-transparent text-white border-2 border-white hover:bg-white hover:text-loly-ember active:scale-95 transition-all px-9 py-3.5 font-loly-heading uppercase tracking-wider text-sm"
            >
              Bekijk schema
            </Link>
          </div>

          <div className="border-t border-white/20 pt-12 space-y-3">
            <div className="flex items-center justify-center gap-2 text-white/65 font-loly-body text-sm">
              <MapPin width={15} height={15} />
              &lsquo;t Keerwater, Buiksloterweg, Amsterdam Noord
            </div>
            <p className="font-loly-body text-white/45 text-sm">
              contact@buurtsaunalooyly.nl
            </p>
            <p className="font-loly-heading text-white/30 text-xs uppercase tracking-widest mt-6">
              © 2025 Buurtsauna Löyly
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
