import api from './api';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export const cartService = {
  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart(product: { _id: string; name: string; price: number }, quantity = 1): void {
    if (typeof window === 'undefined') return;
    
    const cart = this.getCart();
    const existingItem = cart.find(item => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  },

  updateQuantity(productId: string, quantity: number): void {
    if (typeof window === 'undefined') return;
    
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  },

  removeFromCart(productId: string): void {
    if (typeof window === 'undefined') return;
    
    const cart = this.getCart().filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  clearCart(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cart');
  },

  getTotal(): number {
    return this.getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getItemCount(): number {
    return this.getCart().reduce((count, item) => count + item.quantity, 0);
  },

  async checkout(): Promise<any> {
    const cart = this.getCart();
    const items = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const response = await api.post('/orders', { items });
    
    if (response.data.success) {
      this.clearCart();
    }
    
    return response.data;
  },
};