/**
 * Client API PrestaShop - Version directe
 * Utilise l'endpoint api.php direct sans le bootstrap PrestaShop
 */

import type { 
  Product, 
  Category, 
  SearchFilters, 
  PaginatedResponse,
} from '@/types/prestashop';

// URL de l'API directe
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://www.ravenindustries.fr';
  }
  // Côté serveur - utiliser l'URL interne si disponible
  return process.env.PRESTASHOP_INTERNAL_URL || process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://www.ravenindustries.fr';
};

interface ApiProductsResponse {
  success: boolean;
  data: ApiProduct[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

interface ApiProductResponse {
  success: boolean;
  product: ApiProductDetail;
}

interface ApiCategoriesResponse {
  success: boolean;
  categories: ApiCategory[];
}

interface ApiCategoryResponse {
  success: boolean;
  category: ApiCategoryDetail;
}

interface ApiSearchResponse {
  success: boolean;
  products: ApiProduct[];
  total: number;
}

interface ApiManufacturersResponse {
  success: boolean;
  manufacturers: ApiManufacturer[];
}

interface ApiBrandsResponse {
  success: boolean;
  brands: ApiBrand[];
}

interface ApiBrandCategory {
  id: number;
  name: string;
  link_rewrite: string;
  image: string | null;
}

interface ApiBrand {
  name: string;
  slug: string;
  categories: ApiBrandCategory[];
  product_count: number;
  image: string | null;
  url: string;
}

interface ApiProduct {
  id: number;
  name: string;
  description_short: string;
  link_rewrite: string;
  price: number;
  reference: string;
  in_stock: boolean;
  quantity: number;
  on_sale: boolean;
  cover_image: string | null;
  url: string;
}

interface ApiProductDetail extends ApiProduct {
  description: string;
  ean13: string;
  weight: number;
  manufacturer: string | null;
  manufacturer_id: number;
  images: Array<{
    id: number;
    url: string;
    thumb: string;
    cover: boolean;
  }>;
  categories: Array<{
    id_category: number;
    name: string;
    link_rewrite: string;
  }>;
}

interface ApiCategory {
  id: number;
  name: string;
  link_rewrite: string;
  level_depth: number;
  parent_id: number;
  url: string;
  image: string | null;
  nb_products?: number;
}

interface ApiCategoryDetail extends ApiCategory {
  description: string;
}

interface ApiManufacturer {
  id: number;
  name: string;
  url: string;
}

// Transformer ApiProduct vers Product du type prestashop
function transformProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description_short: apiProduct.description_short,
    description: '',
    link_rewrite: apiProduct.link_rewrite,
    reference: apiProduct.reference,
    price: apiProduct.price,
    price_without_reduction: apiProduct.price,
    reduction: 0,
    reduction_type: 'percentage',
    quantity: apiProduct.quantity,
    id_category_default: 0,
    active: true,
    available_for_order: apiProduct.in_stock,
    on_sale: apiProduct.on_sale,
    cover_image: apiProduct.cover_image || '/placeholder.png',
    images: apiProduct.cover_image ? [{ id: 0, url: apiProduct.cover_image, cover: true }] : [],
    categories: [],
    manufacturer: undefined,
  };
}

function transformProductDetail(apiProduct: ApiProductDetail): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description_short: apiProduct.description_short,
    description: apiProduct.description,
    link_rewrite: apiProduct.link_rewrite,
    reference: apiProduct.reference,
    price: apiProduct.price,
    price_without_reduction: apiProduct.price,
    reduction: 0,
    reduction_type: 'percentage',
    quantity: apiProduct.quantity,
    id_category_default: apiProduct.categories[0]?.id_category || 0,
    active: true,
    available_for_order: apiProduct.in_stock,
    on_sale: apiProduct.on_sale,
    ean13: apiProduct.ean13,
    weight: apiProduct.weight,
    cover_image: apiProduct.images.find(i => i.cover)?.url || apiProduct.images[0]?.url || '/placeholder.png',
    images: apiProduct.images.map(img => ({ id: img.id, url: img.url, cover: img.cover })),
    categories: apiProduct.categories.map(c => ({
      id: c.id_category,
      name: c.name,
      link_rewrite: c.link_rewrite,
    })),
    manufacturer: apiProduct.manufacturer ? {
      id: apiProduct.manufacturer_id,
      name: apiProduct.manufacturer,
    } : undefined,
    manufacturer_name: apiProduct.manufacturer || undefined,
  };
}

function transformCategory(apiCategory: ApiCategory | ApiCategoryDetail): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    description: 'description' in apiCategory ? apiCategory.description : '',
    link_rewrite: apiCategory.link_rewrite,
    level_depth: apiCategory.level_depth,
    id_parent: apiCategory.parent_id,
    active: true,
    nb_products: apiCategory.nb_products || 0,
    image: apiCategory.image || undefined,
  };
}

/**
 * Fetch avec retry et meilleure gestion d'erreur
 */
async function fetchDirectApi<T>(action: string, params: Record<string, string | number> = {}): Promise<T> {
  // Utiliser l'URL publique (résolu vers localhost via /etc/hosts dans Docker)
  const baseUrl = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://www.ravenindustries.fr';
  
  const url = new URL(`${baseUrl}/api.php`);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 60 }, // Cache 60 secondes pour SSR
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * API Produits
 */
export const productsApi = {
  async getAll(filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    const params: Record<string, string | number> = {};
    
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.category) params.category = filters.category;

    const response = await fetchDirectApi<ApiProductsResponse>('products', params);
    
    return {
      data: response.data.map(transformProduct),
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.per_page,
      total_pages: response.pagination.total_pages,
    };
  },

  async getById(id: number | string): Promise<Product> {
    const response = await fetchDirectApi<ApiProductResponse>('product', { id: Number(id) });
    return transformProductDetail(response.product);
  },

  async getByCategory(categoryId: number | string, options?: { page?: number; limit?: number; sort?: string; min_price?: number; max_price?: number; in_stock?: boolean; on_sale?: boolean }): Promise<PaginatedResponse<Product>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const response = await fetchDirectApi<ApiProductsResponse>('products', {
      category: Number(categoryId),
      page,
      limit,
    });
    
    return {
      data: response.data.map(transformProduct),
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.per_page,
      total_pages: response.pagination.total_pages,
    };
  },

  async search(query: string, filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    const limit = filters?.limit || 20;
    const response = await fetchDirectApi<ApiSearchResponse>('search', { q: query, limit });
    return {
      data: response.products.map(transformProduct),
      total: response.total,
      page: filters?.page || 1,
      limit,
      total_pages: Math.ceil(response.total / limit),
    };
  },

  async getFeatured(limit = 8): Promise<Product[]> {
    const response = await fetchDirectApi<ApiProductsResponse>('products', { limit });
    return response.data.map(transformProduct);
  },

  async getNewProducts(limit = 8): Promise<Product[]> {
    const response = await fetchDirectApi<ApiProductsResponse>('products', { limit });
    return response.data.map(transformProduct);
  },
};

/**
 * API Catégories
 */
export const categoriesApi = {
  async getAll(parentId = 2): Promise<Category[]> {
    const response = await fetchDirectApi<ApiCategoriesResponse>('categories', { parent: parentId });
    return response.categories.map(transformCategory);
  },

  async getById(id: number | string): Promise<Category> {
    const response = await fetchDirectApi<ApiCategoryResponse>('category', { id: Number(id) });
    return transformCategory(response.category);
  },

  async getTree(): Promise<Category[]> {
    // Récupérer les catégories principales (enfants de Home = 2)
    return this.getAll(2);
  },
};

/**
 * API Fabricants/Marques PrestaShop
 */
export const manufacturersApi = {
  async getAll(): Promise<Array<{ id: number; name: string; url: string }>> {
    const response = await fetchDirectApi<ApiManufacturersResponse>('manufacturers');
    return response.manufacturers;
  },
};

/**
 * API Marques de véhicules (extraites des catégories)
 */
export interface BrandCategory {
  id: number;
  name: string;
  linkRewrite: string;
  image: string | null;
}

export interface Brand {
  name: string;
  slug: string;
  categories: BrandCategory[];
  productCount: number;
  image: string | null;
  url: string;
}

export const brandsApi = {
  async getAll(): Promise<Brand[]> {
    const response = await fetchDirectApi<ApiBrandsResponse>('brands');
    return response.brands.map(b => ({
      name: b.name,
      slug: b.slug,
      categories: (b.categories || []).map(c => ({
        id: c.id,
        name: c.name,
        linkRewrite: c.link_rewrite,
        image: c.image,
      })),
      productCount: b.product_count,
      image: b.image,
      url: b.url,
    }));
  },
};

/**
 * API Recherche
 */
export const searchApi = {
  async search(query: string): Promise<{ products: Product[]; total: number }> {
    const response = await fetchDirectApi<ApiSearchResponse>('search', { q: query, limit: 50 });
    return {
      products: response.products.map(transformProduct),
      total: response.total,
    };
  },
};

// Export par défaut pour compatibilité
export default {
  products: productsApi,
  categories: categoriesApi,
  manufacturers: manufacturersApi,
  brands: brandsApi,
  search: searchApi,
};
