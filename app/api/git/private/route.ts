import { NextRequest, NextResponse } from 'next/server';
import { makeRepoPrivate } from '@/lib/github';
import { isAdminRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await makeRepoPrivate();
    return NextResponse.json({ success: true, res }, { status: 200 });
  } catch (error: any) {
    console.error('Make private error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
