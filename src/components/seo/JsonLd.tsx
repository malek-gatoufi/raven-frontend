interface OrganizationProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

interface ProductProps {
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability';
  brand?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  url?: string;
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  category?: string;
  weight?: string;
  reviews?: {
    averageRating: number;
    reviewCount: number;
  };
  validUntil?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

interface WebPageProps {
  name: string;
  description?: string;
  url?: string;
}

export function OrganizationSchema({
  name = 'Raven Industries',
  url = 'https://new.ravenindustries.fr',
  logo = 'https://new.ravenindustries.fr/logo.png',
  description = 'Spécialiste de la pièce détachée pour moto, quad, jet-ski et motoneige',
}: OrganizationProps = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@ravenindustries.fr',
    },
    sameAs: [
      // Ajouter les liens réseaux sociaux ici
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Raven Industries',
    url: 'https://new.ravenindustries.fr',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://new.ravenindustries.fr/recherche?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  image,
  images,
  price,
  oldPrice,
  priceCurrency = 'EUR',
  availability = 'InStock',
  brand,
  sku,
  gtin,
  mpn,
  url,
  condition = 'NewCondition',
  category,
  weight,
  reviews,
  validUntil,
}: ProductProps) {
  const hasDiscount = oldPrice && oldPrice > price;
  
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images && images.length > 0 ? images : image,
    sku,
    gtin13: gtin,
    mpn,
    category,
    weight: weight ? {
      '@type': 'QuantitativeValue',
      value: parseFloat(weight),
      unitCode: 'KGM',
    } : undefined,
    itemCondition: `https://schema.org/${condition}`,
    brand: brand ? {
      '@type': 'Brand',
      name: brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency,
      availability: `https://schema.org/${availability}`,
      url,
      priceValidUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: `https://schema.org/${condition}`,
      seller: {
        '@type': 'Organization',
        name: 'Raven Industries',
        url: 'https://new.ravenindustries.fr',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'd',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };

  // Add aggregate rating if reviews exist
  if (reviews && reviews.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviews.averageRating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      reviewCount: reviews.reviewCount,
    };
  }

  // Add price specification for discounts
  if (hasDiscount) {
    (schema.offers as Record<string, unknown>).priceSpecification = {
      '@type': 'PriceSpecification',
      price: price.toFixed(2),
      priceCurrency,
      valueAddedTaxIncluded: true,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: BreadcrumbProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Raven Industries',
    description: 'Spécialiste de la pièce détachée pour moto, quad, jet-ski et motoneige',
    url: 'https://new.ravenindustries.fr',
    telephone: '+33123456789',
    email: 'contact@ravenindustries.fr',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    priceRange: '€€',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebPageSchema({ name, description, url }: WebPageProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Raven Industries',
      url: 'https://new.ravenindustries.fr',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Collection/Category schema for product listing pages
interface CollectionPageProps {
  name: string;
  description?: string;
  url?: string;
  products?: Array<{
    id: number;
    name: string;
    price: number;
    image?: string;
    url: string;
  }>;
  totalProducts?: number;
}

export function CollectionPageSchema({ 
  name, 
  description, 
  url, 
  products,
  totalProducts 
}: CollectionPageProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalProducts || products?.length || 0,
      itemListElement: products?.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': product.url,
          name: product.name,
          image: product.image,
          offers: {
            '@type': 'Offer',
            price: product.price.toFixed(2),
            priceCurrency: 'EUR',
          },
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// HowTo schema for guides/tutorials
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToProps {
  name: string;
  description?: string;
  totalTime?: string;
  steps: HowToStep[];
  image?: string;
}

export function HowToSchema({ name, description, totalTime, steps, image }: HowToProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    image,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Review schema (single review)
interface ReviewSchemaProps {
  productName: string;
  reviewBody: string;
  ratingValue: number;
  authorName: string;
  datePublished: string;
}

export function ReviewSchema({ 
  productName, 
  reviewBody, 
  ratingValue, 
  authorName, 
  datePublished 
}: ReviewSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: productName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: authorName,
    },
    reviewBody,
    datePublished,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Offer Catalog for special promotions
interface OfferCatalogProps {
  name: string;
  description?: string;
  offers: Array<{
    name: string;
    price: number;
    oldPrice?: number;
    url: string;
    validFrom?: string;
    validThrough?: string;
  }>;
}

export function OfferCatalogSchema({ name, description, offers }: OfferCatalogProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name,
    description,
    itemListElement: offers.map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      price: offer.price.toFixed(2),
      priceCurrency: 'EUR',
      url: offer.url,
      priceValidUntil: offer.validThrough,
      availability: 'https://schema.org/InStock',
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

