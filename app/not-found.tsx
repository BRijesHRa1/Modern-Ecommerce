import Link from 'next/link';
import Image from 'next/image';
import { Home, Search } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-lg text-center">
          <h1 className="text-6xl font-bold text-indigo-600 mb-6">404</h1>
          <Image
            src="https://illustrations.popsy.co/gray/falling.svg"
            alt="Page not found illustration"
            width={300}
            height={300}
            className="mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Search className="mr-2 h-5 w-5" />
              Browse products
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 