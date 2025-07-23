import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      session: session,
      hasSession: !!session,
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null,
    });
  } catch (error) {
    console.error('Session test error:', error);
    return NextResponse.json(
      { error: 'Session test failed', details: error },
      { status: 500 }
    );
  }
}
