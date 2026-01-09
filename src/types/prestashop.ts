/**
 * Types pour l'API PrestaShop
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  description_short: string;
  price: number;
  price_without_reduction: number;
  reduction: number;
  reduction_type: 'percentage' | 'amount';
  quantity: number;
  reference?: string;
  ean13?: string;
  id_category_default: number;
  category_name?: string;
  categories?: Array<{ id: number; name: string; link_rewrite: string }>;
  images?: ProductImage[];
  cover_image?: string;
  manufacturer?: { id: number; name: string };
  manufacturer_name?: string;
  condition?: 'new' | 'used' | 'refurbished';
  active: boolean;
  on_sale: boolean;
  available_for_order: boolean;
  link_rewrite: string;
  meta_title?: string;
  meta_description?: string;
  weight?: number;
  attributes?: ProductAttribute[];
  features?: ProductFeature[];
  attachments?: ProductAttachment[];
  combinations?: ProductCombination[];
}

export interface ProductAttachment {
  id: number;
  name: string;
  description?: string;
  file_name: string;
  file_size: number;
  mime: string;
}

export interface ProductCombination {
  id: number;
  reference: string;
  price: number;
  quantity: number;
  attributes: ProductAttribute[];
}

export interface ProductImage {
  id: number;
  url: string;
  cover?: boolean;
  position?: number;
}

export interface ProductAttribute {
  id: number;
  id_attribute_group: number;
  group_name: string;
  name: string;
  color?: string;
  position?: number;
}

export interface ProductFeature {
  id: number;
  name: string;
  value: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  link_rewrite: string;
  id_parent: number;
  level_depth: number;
  active: boolean;
  position?: number;
  image?: string;
  children?: Category[];
  nb_products?: number;
}

export interface CartItem {
  id_product: number;
  id_product_attribute: number;
  quantity: number;
  name: string;
  reference: string;
  price: number;
  total: number;
  image_url: string | null;
  link_rewrite: string;
  attributes?: string;
  product?: Product; // Legacy compatibility
}

export interface Cart {
  id: number;
  id_customer: number;
  items: CartItem[];
  total: number;
  total_products: number;
  total_shipping: number;
  total_discounts: number;
}

export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthday?: string;
  newsletter: boolean;
  addresses?: Address[];
}

export interface Address {
  id: number;
  alias: string;
  firstname: string;
  lastname: string;
  company?: string;
  address1: string;
  address2?: string;
  postcode: string;
  city: string;
  id_country: number;
  country: string; // Nom du pays pour l'affichage
  id_state?: number;
  phone?: string;
  phone_mobile?: string;
}

export interface OrderHistory {
  id_order_state: number;
  state_name: string;
  date_add: string;
}

export interface Order {
  id: number;
  reference: string;
  id_customer: number;
  current_state: number;
  state_name: string;
  payment: string;
  total_paid: number;
  total_products: number;
  total_shipping: number;
  total_discounts?: number;
  date_add: string;
  date_upd: string;
  items: OrderItem[];
  address_delivery?: Address;
  address_invoice?: Address;
  history?: OrderHistory[];
  invoice_url?: string;
}

export interface OrderItem {
  id: number;
  id_product: number;
  id_product_attribute: number;
  product_name: string;
  product_reference: string;
  product_quantity: number;
  unit_price: number;
  total_price: number;
}

export interface SearchFilters {
  q?: string;
  category?: number;
  min_price?: number;
  max_price?: number;
  manufacturer?: number;
  condition?: string;
  in_stock?: boolean;
  on_sale?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'date_desc' | 'sales_desc' | 'relevance';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  code: number;
  message: string;
  errors?: Record<string, string[]>;
}
