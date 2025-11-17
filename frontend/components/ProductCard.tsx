'use client';

import { Product } from '@/lib/products';
import { cartService } from '@/lib/cart';
import { useState } from 'react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  onEdit?: (product: Product) => void;
  isAdmin?: boolean;
}

export default function ProductCard({ product, onDelete, onEdit, isAdmin }: ProductCardProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    setAdding(true);
    cartService.addToCart(product, 1);
    
    setTimeout(() => {
      setAdding(false);
      alert(`${product.name} added to cart!`);
    }, 300);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description || 'No description available'}
      </p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-green-600">
          ₹{product.price.toLocaleString()}
        </span>
        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {isAdmin ? (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(product)}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(product._id)}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
}