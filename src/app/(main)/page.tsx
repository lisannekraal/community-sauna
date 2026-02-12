import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display uppercase mb-8">Welcome, {session.user.name}</h1>
        <p className="mb-4">
          <Link href="/schedule" className="underline font-medium hover:no-underline">
            View schedule →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-display uppercase mb-6">Community Sauna</h1>
        <p className="text-xl text-gray-600 mb-8">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum eveniet maiores illum repudiandae tempore natus expedita quibusdam temporibus dolorum rerum deleniti possimus, fuga est quam deserunt pariatur ratione, nam ipsum!
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 border-2 border-black font-medium hover:bg-black hover:text-white"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
