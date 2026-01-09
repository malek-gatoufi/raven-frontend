/**
 * Client API PrestaShop via module ravenapi
 * Gère les appels vers le backend PrestaShop
 */

import { API_CONFIG } from './config';
import type { 
  Product, 
  Category, 
  Cart, 
  Customer, 
  Order, 
  Address,
  SearchFilters, 
  PaginatedResponse,
  ApiError 
} from '@/types/prestashop';

class PrestaShopApiError extends Error {
  code: number;
  errors?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'PrestaShopApiError';
    this.code = error.code;
    this.errors = error.errors;
  }
}

/**
 * Fetch wrapper avec gestion d'erreurs
 */
async function fetchApi<T>(
  controller: string, 
  params: Record<string, string | number | boolean> = {},
  options: RequestInit = {}
): Promise<T> {
  const url = API_CONFIG.buildUrl(controller, params);
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: response.status,
      message: response.statusText,
    }));
    // Don't log 401 errors (expected for unauthenticated users)
    if (response.status !== 401) {
      console.error('API Error:', response.status, error);
    }
    throw new PrestaShopApiError(error);
  }

  return response.json();
}

/**
 * API Produits
 */
export const productsApi = {
  async getAll(filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    const params: Record<string, string | number | boolean> = {};
    
    if (filters) {
      if (filters.q) params.q = filters.q;
      if (filters.category) params.category = filters.category;
      if (filters.manufacturer) params.manufacturer = filters.manufacturer;
      if (filters.min_price !== undefined) params.price_min = filters.min_price;
      if (filters.max_price !== undefined) params.price_max = filters.max_price;
      if (filters.in_stock) params.in_stock = true;
      if (filters.on_sale) params.on_sale = true;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.per_page = filters.limit;
      if (filters.sort) params.sort = filters.sort;
    }

    const response = await fetchApi<{data: Product[], pagination: {total: number, page: number, per_page: number, total_pages: number}}>('products', params);
    
    return {
      data: response.data,
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.per_page,
      total_pages: response.pagination.total_pages,
    };
  },

  async getById(id: number | string): Promise<Product> {
    const response = await fetchApi<{product: Product, related_products: Product[]}>('product', { id: String(id) });
    return response.product;
  },

  async getByCategory(categoryId: number, filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    return this.getAll({ ...filters, category: categoryId });
  },

  async search(query: string, filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    return this.getAll({ ...filters, q: query });
  },

  async getOnSale(limit?: number): Promise<Product[]> {
    const response = await this.getAll({ on_sale: true, limit: limit || 12 });
    return response.data;
  },

  async getNew(limit?: number): Promise<Product[]> {
    const response = await this.getAll({ sort: 'date_desc', limit: limit || 12 });
    return response.data;
  },

  async getBestSellers(limit?: number): Promise<Product[]> {
    const response = await this.getAll({ sort: 'sales_desc', limit: limit || 12 });
    return response.data;
  },
};

/**
 * API Catégories
 */
export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const response = await fetchApi<{categories: Category[]}>('categories', { format: 'tree' });
    return response.categories;
  },

  async getById(id: number | string): Promise<Category & { filters: object }> {
    const response = await fetchApi<{category: Category, filters: object}>('category', { id: String(id) });
    return { ...response.category, filters: response.filters };
  },

  async getMain(): Promise<Category[]> {
    const response = await fetchApi<{categories: Category[]}>('categories', { format: 'flat' });
    return response.categories.filter((cat: Category) => cat.level_depth === 1);
  },

  async getChildren(parentId: number): Promise<Category[]> {
    const response = await fetchApi<{categories: Category[]}>('categories', { parent: parentId, format: 'flat' });
    return response.categories;
  },
};

/**
 * API Panier
 */
export const cartApi = {
  async get(): Promise<Cart> {
    const response = await fetchApi<{cart: Cart}>('cart');
    return response.cart;
  },

  async addItem(productId: number, quantity: number = 1, attributeId?: number): Promise<Cart> {
    const response = await fetchApi<{cart: Cart}>('cart', {}, {
      method: 'POST',
      body: JSON.stringify({
        action: 'add',
        id_product: productId,
        id_product_attribute: attributeId || 0,
        quantity,
      }),
    });
    return response.cart;
  },

  async updateItem(productId: number, quantity: number, attributeId?: number): Promise<Cart> {
    const response = await fetchApi<{cart: Cart}>('cart', {}, {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        id_product: productId,
        id_product_attribute: attributeId || 0,
        quantity,
      }),
    });
    return response.cart;
  },

  async removeItem(productId: number, attributeId?: number): Promise<Cart> {
    const response = await fetchApi<{cart: Cart}>('cart', {}, {
      method: 'POST',
      body: JSON.stringify({
        action: 'remove',
        id_product: productId,
        id_product_attribute: attributeId || 0,
      }),
    });
    return response.cart;
  },

  async clear(): Promise<void> {
    await fetchApi<{success: boolean}>('cart', {}, {
      method: 'DELETE',
    });
  },

  async applyPromoCode(code: string): Promise<Cart> {
    const response = await fetchApi<{cart: Cart}>('cart', {}, {
      method: 'POST',
      body: JSON.stringify({ action: 'promo', code }),
    });
    return response.cart;
  },

  async removePromoCode(code: string): Promise<Cart> {
    const response = await fetchApi<{cart: Cart}>('cart', {}, {
      method: 'POST',
      body: JSON.stringify({ action: 'remove_promo', code }),
    });
    return response.cart;
  },
};

/**
 * API Authentification
 */
export const authApi = {
  async login(email: string, password: string): Promise<Customer> {
    const response = await fetchApi<{customer: Customer}>('auth', { action: 'login' }, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.customer;
  },

  async logout(): Promise<void> {
    await fetchApi<{success: boolean}>('auth', { action: 'logout' }, {
      method: 'POST',
    });
  },

  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    newsletter?: boolean;
  }): Promise<Customer> {
    const response = await fetchApi<{customer: Customer}>('auth', { action: 'register' }, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.customer;
  },

  async getMe(): Promise<Customer | null> {
    try {
      const response = await fetchApi<{customer: Customer}>('customer');
      return response.customer;
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await fetchApi<{success: boolean}>('auth', { action: 'forgot' }, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await fetchApi<{success: boolean}>('auth', { action: 'reset' }, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

/**
 * API Compte Client
 */
export const customerApi = {
  async updateProfile(data: Partial<Customer>): Promise<Customer> {
    const response = await fetchApi<{customer: Customer}>('customer', {}, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.customer;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await fetchApi<{success: boolean}>('customer', {}, {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  async getOrders(page: number = 1): Promise<PaginatedResponse<Order>> {
    const response = await fetchApi<{data: Order[], pagination: {total: number, page: number, per_page: number, total_pages: number}}>('orders', { page });
    return {
      data: response.data || [],
      total: response.pagination?.total || 0,
      page: response.pagination?.page || 1,
      limit: response.pagination?.per_page || 10,
      total_pages: response.pagination?.total_pages || 0,
    };
  },

  async getOrder(reference: string): Promise<Order> {
    const response = await fetchApi<{order: Order}>('order', { reference });
    return response.order;
  },

  async getAddresses(): Promise<Address[]> {
    const response = await fetchApi<{addresses: Address[]}>('addresses');
    return response.addresses;
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const response = await fetchApi<{address: Address}>('addresses', {}, {
      method: 'POST',
      body: JSON.stringify(address),
    });
    return response.address;
  },

  async updateAddress(id: number, address: Partial<Address>): Promise<Address> {
    const response = await fetchApi<{address: Address}>('addresses', { id }, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
    return response.address;
  },

  async deleteAddress(id: number): Promise<void> {
    await fetchApi<{success: boolean}>('addresses', { id }, {
      method: 'DELETE',
    });
  },

  async getVouchers(): Promise<Array<{
    id: number;
    code: string;
    name: string;
    description: string;
    value: string;
    quantity: number;
    minimum: string;
    cumulative: boolean;
    expiration_date: string;
    is_expired: boolean;
  }>> {
    const response = await fetchApi<{vouchers: Array<{
      id: number;
      code: string;
      name: string;
      description: string;
      value: string;
      quantity: number;
      minimum: string;
      cumulative: boolean;
      expiration_date: string;
      is_expired: boolean;
    }>}>('vouchers');
    return response.vouchers || [];
  },

  async getReturns(): Promise<Array<{
    id: number;
    order_reference: string;
    return_number: string;
    state: number;
    state_name: string;
    date_add: string;
    details_url: string;
    return_url: string;
    print_url?: string;
    products: Array<{
      name: string;
      quantity: number;
      reason: string;
    }>;
  }>> {
    const response = await fetchApi<{returns: Array<{
      id: number;
      order_reference: string;
      return_number: string;
      state: number;
      state_name: string;
      date_add: string;
      details_url: string;
      return_url: string;
      print_url?: string;
      products: Array<{
        name: string;
        quantity: number;
        reason: string;
      }>;
    }>}>('returns');
    return response.returns || [];
  },

  async getCreditSlips(): Promise<Array<{
    id: number;
    reference: string;
    order_reference: string;
    amount: number;
    date_add: string;
    pdf_url?: string;
  }>> {
    const response = await fetchApi<{credit_slips: Array<{
      id: number;
      reference: string;
      order_reference: string;
      amount: number;
      date_add: string;
      pdf_url?: string;
    }>}>('creditslips');
    return response.credit_slips || [];
  },
};

/**
 * API Checkout
 */
export const checkoutApi = {
  async getInfo(): Promise<{
    cart: Cart;
    addresses: Address[];
    carriers: Array<{id: number; name: string; price: number; delay: string}>;
    payment_options: Array<{module: string; name: string; logo?: string}>;
  }> {
    return fetchApi<{
      cart: Cart;
      addresses: Address[];
      carriers: Array<{id: number; name: string; price: number; delay: string}>;
      payment_options: Array<{module: string; name: string; logo?: string}>;
    }>('checkout');
  },

  async updateStep(step: string, data: Record<string, unknown>): Promise<{success: boolean}> {
    return fetchApi<{success: boolean}>('checkout', {}, {
      method: 'PUT',
      body: JSON.stringify({ step, ...data }),
    });
  },

  async validate(paymentModule: string, cgv: boolean): Promise<{order_reference: string; order_id: number}> {
    return fetchApi<{order_reference: string; order_id: number}>('checkout', {}, {
      method: 'POST',
      body: JSON.stringify({ payment_module: paymentModule, cgv }),
    });
  },
};

/**
 * API Paiement
 */
export const paymentApi = {
  async getMethods(): Promise<{
    payment_methods: Array<{
      id: string;
      name: string;
      type: 'redirect' | 'offline';
      icon?: string;
      description: string;
      details?: Record<string, string>;
    }>;
    cart_total: number;
    currency: string;
  }> {
    return fetchApi<{
      payment_methods: Array<{
        id: string;
        name: string;
        type: 'redirect' | 'offline';
        icon?: string;
        description: string;
        details?: Record<string, string>;
      }>;
      cart_total: number;
      currency: string;
    }>('payment', { action: 'methods' });
  },

  async initPayment(paymentMethod: string): Promise<{
    success: boolean;
    payment_method: string;
    redirect_url?: string;
    order?: {
      id: number;
      reference: string;
      total: number;
      status: string;
    };
    payment_details?: Record<string, string>;
  }> {
    return fetchApi<{
      success: boolean;
      payment_method: string;
      redirect_url?: string;
      order?: {
        id: number;
        reference: string;
        total: number;
        status: string;
      };
      payment_details?: Record<string, string>;
    }>('payment', { action: 'init' }, {
      method: 'POST',
      body: JSON.stringify({ payment_method: paymentMethod }),
    });
  },

  async checkStatus(orderReference: string): Promise<{
    success: boolean;
    order: {
      id: number;
      reference: string;
      total: number;
      status: string;
      is_paid: boolean;
      is_shipped: boolean;
      is_delivered: boolean;
    };
  }> {
    return fetchApi<{
      success: boolean;
      order: {
        id: number;
        reference: string;
        total: number;
        status: string;
        is_paid: boolean;
        is_shipped: boolean;
        is_delivered: boolean;
      };
    }>('payment', { action: 'status', reference: orderReference });
  },
};

/**
 * API Recherche
 */
export const searchApi = {
  async search(query: string, limit: number = 10): Promise<{
    products: Product[];
    suggestions: Array<{type: string; value: string; label: string}>;
  }> {
    return fetchApi<{
      products: Product[];
      suggestions: Array<{type: string; value: string; label: string}>;
    }>('search', { q: query, limit });
  },
};

/**
 * API globale consolidée
 */
export const api = {
  products: productsApi,
  categories: categoriesApi,
  cart: cartApi,
  auth: authApi,
  customer: customerApi,
  checkout: checkoutApi,
  search: searchApi,
  
  getProducts: productsApi.getAll.bind(productsApi),
  getProduct: productsApi.getById.bind(productsApi),
  getCategories: categoriesApi.getAll.bind(categoriesApi),
  getCategory: categoriesApi.getById.bind(categoriesApi),
  getCart: cartApi.get.bind(cartApi),
  addToCart: cartApi.addItem.bind(cartApi),
  searchProducts: productsApi.search.bind(productsApi),
};

export { PrestaShopApiError };
