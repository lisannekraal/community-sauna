import { LandingNav } from '@/components/landing/landing-nav';

export default function AuthLayout({
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
