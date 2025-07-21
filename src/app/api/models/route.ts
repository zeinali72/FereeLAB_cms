import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to fetch models from OpenRouter', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the models to match our interface
    const transformedModels = data.data?.map((model: unknown) => {
      const modelData = model as Record<string, unknown>;
      return {
        id: modelData.id as string,
        name: (modelData.name || modelData.id) as string,
        description: (modelData.description || '') as string,
        context_length: (modelData.context_length || 4000) as number,
        pricing: {
          prompt: ((modelData.pricing as Record<string, unknown>)?.prompt || '0') as string,
          completion: ((modelData.pricing as Record<string, unknown>)?.completion || '0') as string,
        },
        provider: {
          id: (modelData.id as string).split('/')[0] || 'unknown',
          name: (modelData.id as string).split('/')[0] || 'Unknown',
        },
        maxTokens: (modelData.context_length || 4000) as number,
        inputPrice: parseFloat(((modelData.pricing as Record<string, unknown>)?.prompt || '0') as string),
        outputPrice: parseFloat(((modelData.pricing as Record<string, unknown>)?.completion || '0') as string),
      };
    }) || [];

    return NextResponse.json({ models: transformedModels });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}