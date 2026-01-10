import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://new.ravenindustries.fr';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.ravenindustries.fr';

interface Product {
  id: number;
  link_rewrite?: string;
  date_upd?: string;
  date_add?: string;
}

interface Category {
  id: number;
  slug: string;
  id_category?: number;
  link_rewrite?: string;
}

interface Manufacturer {
  id: number;
}

interface CmsPage {
  slug: string;
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/index.php?fc=module&module=ravenapi&controller=products&action=list&limit=1000`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    return data.success ? data.products : [];
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/index.php?fc=module&module=ravenapi&controller=categories&action=list`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    return data.success ? data.categories : [];
  } catch {
    return [];
  }
}

async function fetchManufacturers(): Promise<Manufacturer[]> {
  try {
    const response = await fetch(`${API_URL}/index.php?fc=module&module=ravenapi&controller=manufacturers&action=list`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    return data.success ? data.manufacturers : [];
  } catch {
    return [];
  }
}

async function fetchCmsPages(): Promise<CmsPage[]> {
  try {
    const response = await fetch(`${API_URL}/index.php?fc=module&module=ravenapi&controller=cms&action=list`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    return data.success ? data.pages : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/recherche`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/panier`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/connexion`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/inscription`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/marque`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
  
  // Récupérer les données dynamiques en parallèle
  const [products, categories, manufacturers, cmsPages] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchManufacturers(),
    fetchCmsPages(),
  ]);
  
  // Pages produits
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/produit/${product.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Pages catégories
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/categorie/${category.slug || category.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // Pages marques
  const manufacturerPages: MetadataRoute.Sitemap = manufacturers.map((manufacturer) => ({
    url: `${BASE_URL}/marque/${manufacturer.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  // Pages CMS
  const cmsPagesList: MetadataRoute.Sitemap = cmsPages.map((page) => ({
    url: `${BASE_URL}/cms/${page.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  
  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...manufacturerPages,
    ...cmsPagesList,
  ];
}
