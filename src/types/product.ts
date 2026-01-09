export interface ProductImage {
  id: number;
  small: string;
  medium: string;
  large: string;
}

export interface ProductCover {
  small: string;
  medium: string;
  large: string;
}

export interface ProductAttribute {
  id_product_attribute: number;
  reference?: string;
  price?: number;
  quantity?: number;
  ean13?: string;
  weight?: number;
  attributes?: Record<string, string>;
}

export interface Product {
  id: number;
  name: string;
  reference?: string;
  description?: string;
  description_short?: string;
  price: number;
  price_without_reduction?: number;
  quantity: number;
  minimal_quantity?: number;
  available_now?: string;
  available_later?: string;
  condition?: 'new' | 'used' | 'refurbished';
  manufacturer_name?: string;
  id_manufacturer?: number;
  id_category_default: number;
  category_name?: string;
  link_rewrite?: string;
  ean13?: string;
  isbn?: string;
  upc?: string;
  weight?: number;
  unity?: string;
  unit_price?: number;
  on_sale?: boolean;
  show_price?: boolean;
  active?: boolean;
  cover?: ProductCover;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  features?: Array<{
    name: string;
    value: string;
  }>;
  attachments?: Array<{
    id: number;
    name: string;
    description?: string;
    file_name: string;
    file_size: number;
    mime: string;
  }>;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  date_add?: string;
  date_upd?: string;
}

export interface Category {
  id: number;
  id_parent: number;
  name: string;
  description?: string;
  link_rewrite: string;
  level_depth?: number;
  nb_products_recursive?: number;
  active?: boolean;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  children?: Category[];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  id_product_attribute?: number;
  reference?: string;
}

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  link: string;
}

export interface Customer {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  birthday?: string;
  newsletter?: boolean;
  optin?: boolean;
}

export interface Address {
  id: number;
  id_customer: number;
  alias: string;
  firstname: string;
  lastname: string;
  company?: string;
  address1: string;
  address2?: string;
  postcode: string;
  city: string;
  id_country: number;
  id_state?: number;
  phone?: string;
  phone_mobile?: string;
}

export interface Order {
  id: number;
  reference: string;
  id_customer: number;
  total_paid: number;
  total_products: number;
  total_shipping: number;
  current_state: number;
  current_state_name?: string;
  date_add: string;
  date_upd: string;
  products?: OrderProduct[];
}

export interface OrderProduct {
  id_product: number;
  id_product_attribute?: number;
  product_name: string;
  product_reference?: string;
  product_quantity: number;
  unit_price: number;
  total_price: number;
}
