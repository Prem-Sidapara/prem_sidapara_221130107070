'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cartService, CartItem } from '@/lib/cart';
import { authService } from '@/lib/auth';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadCart();
  }, []);

  const loadCart = () => {
    setCart(cartService.getCart());
  };

  const updateQuantity = (productId: string, quantity: number) => {
    cartService.updateQuantity(productId, quantity);
    loadCart();
  };

  const removeItem = (productId: string) => {
    cartService.removeFromCart(productId);
    loadCart();
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const result = await cartService.checkout();
      alert(`Order placed successfully! Order ID: ${result.data.orderId}`);
      router.push('/orders');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const total = cartService.getTotal();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-black text-4xl  mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-6 border-b last:border-b-0">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="bg-black px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-blue-500 rounded">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="bg-black px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-lg text-black font-semibold min-w-[100px] text-right">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl  text-black font-bold">Total:</span>
                <span className="text-3xl font-bold text-green-600">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}