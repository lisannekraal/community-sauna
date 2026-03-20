import { LandingNav } from '@/components/landing/landing-nav';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      <main className="pt-14">{children}</main>
    </>
  );
}
