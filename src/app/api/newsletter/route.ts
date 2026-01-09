import { NextRequest, NextResponse } from 'next/server';

const PRESTASHOP_API_URL = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Try to subscribe via PrestaShop newsletter module
    try {
      const response = await fetch(
        `${PRESTASHOP_API_URL}/index.php?fc=module&module=ravenapi&controller=newsletter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          message: 'Inscription réussie !',
          data
        });
      }
    } catch (apiError) {
      console.error('PrestaShop API error:', apiError);
    }

    // Fallback: store locally or in a simple database
    // For now, just return success (in production, save to database)
    console.log('Newsletter subscription:', email);

    return NextResponse.json({
      success: true,
      message: 'Merci pour votre inscription !',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
