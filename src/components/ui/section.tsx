import { colors, sections } from '@/lib/design-tokens';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className={`${sections.divider} py-5`}>
      <h2 className={`text-sm ${colors.textMuted} mb-3`}>{title}</h2>
      {children}
    </section>
  );
}
