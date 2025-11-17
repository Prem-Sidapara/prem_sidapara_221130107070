'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService, User } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const currentUser = authService.getUser();
      setUser(currentUser);
    }
  }, [mounted, pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show basic navbar during SSR
  if (!mounted) {
    return (
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            E-Commerce
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/products" className="hover:underline">
              Products
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          E-Commerce
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          
          {user ? (
            <>
              <Link href="/cart" className="hover:underline">
                Cart
              </Link>
              <Link href="/orders" className="hover:underline">
                Orders
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link href="/admin/products" className="hover:underline text-red-500 font-semibold">
                    Manage Products
                  </Link>
                  <Link href="/admin/reports" className="hover:underline">
                    Reports
                  </Link>
                </>
              )}
              <span className="text-sm bg-blue-700 px-3 py-1 rounded">
                Hello, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}