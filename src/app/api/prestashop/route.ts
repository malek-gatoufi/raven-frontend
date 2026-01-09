import { NextRequest, NextResponse } from 'next/server';

// URL vers PrestaShop (sans www car redirige)
const PRESTASHOP_URL = process.env.PRESTASHOP_INTERNAL_URL || 'https://ravenindustries.fr';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const controller = searchParams.get('controller') || 'products';
  
  // Construire l'URL PrestaShop ravenapi
  const params = new URLSearchParams();
  params.set('fc', 'module');
  params.set('module', 'ravenapi');
  params.set('controller', controller);
  
  // Copier tous les autres paramètres
  searchParams.forEach((value, key) => {
    if (key !== 'controller') {
      params.set(key, value);
    }
  });
  
  const url = `${PRESTASHOP_URL}/index.php?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const text = await response.text();
    
    // Vérifier si c'est du JSON valide
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Invalid JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Invalid response from PrestaShop', preview: text.substring(0, 100) },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from PrestaShop', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const controller = searchParams.get('controller') || 'cart';
  
  // Construire l'URL PrestaShop
  const params = new URLSearchParams();
  params.set('fc', 'module');
  params.set('module', 'ravenapi');
  params.set('controller', controller);
  
  searchParams.forEach((value, key) => {
    if (key !== 'controller') {
      params.set(key, value);
    }
  });
  
  const url = `${PRESTASHOP_URL}/index.php?${params.toString()}`;
  
  try {
    const body = await request.json();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const text = await response.text();
    
    // Vérifier si c'est du JSON valide
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Invalid JSON response from POST:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Invalid response from PrestaShop', preview: text.substring(0, 100) },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from PrestaShop', details: String(error) },
      { status: 500 }
    );
  }
}
