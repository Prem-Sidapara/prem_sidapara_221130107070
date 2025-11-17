import api from './api';

export interface Product {
  _id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const productService = {
  async getAll(
    page = 1,
    limit = 10,
    category?: string,
    search?: string,
    sort = 'desc'
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
    });
    
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  async getById(id: string): Promise<{ success: boolean; data: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(productData: Omit<Product, '_id' | 'updatedAt'>): Promise<any> {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async update(id: string, productData: Partial<Product>): Promise<any> {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async delete(id: string): Promise<any> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};