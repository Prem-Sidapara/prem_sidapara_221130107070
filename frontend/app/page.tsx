import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to E-Commerce Store
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop shop for all your needs
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        
      </div>
    </div>
  );
}