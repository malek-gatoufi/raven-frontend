// Utility function to generate SEO-friendly URLs from product/category names
export function generateSeoSlug(id: number, name: string): string {
  return `${id}-${slugify(name)}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

// Extract ID from slug format: "123-product-name"
export function extractIdFromSlug(slug: string): number {
  const id = slug.split('-')[0];
  return parseInt(id, 10);
}

// Generate category URL
export function getCategoryUrl(id: number, name: string, linkRewrite?: string): string {
  const slug = linkRewrite || slugify(name);
  return `/category/${id}-${slug}`;
}

// Generate product URL
export function getProductUrl(id: number, name: string, linkRewrite?: string): string {
  const slug = linkRewrite || slugify(name);
  return `/product/${id}-${slug}`;
}

// Generate brand/manufacturer URL
export function getBrandUrl(id: number, name: string): string {
  const slug = slugify(name);
  return `/marque/${id}-${slug}`;
}

// Generate CMS page URL
export function getCmsUrl(slug: string): string {
  return `/cms/${slug}`;
}

// Generate search URL with filters
export function getSearchUrl(params: {
  q?: string;
  category?: number;
  brand?: number;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
  sort?: string;
}): string {
  const searchParams = new URLSearchParams();
  
  if (params.q) searchParams.set('q', params.q);
  if (params.category) searchParams.set('category', params.category.toString());
  if (params.brand) searchParams.set('brand', params.brand.toString());
  if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
  if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
  if (params.onSale) searchParams.set('on_sale', 'true');
  if (params.inStock) searchParams.set('in_stock', 'true');
  if (params.sort) searchParams.set('sort', params.sort);
  
  const queryString = searchParams.toString();
  return `/recherche${queryString ? `?${queryString}` : ''}`;
}
