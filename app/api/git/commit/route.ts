import { NextRequest, NextResponse } from 'next/server';
import { commitFile } from '@/lib/github';
import { isAdminRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path, content, message, branch } = body;
    if (!path || !content || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const res = await commitFile(path, content, message, branch || 'main');
    return NextResponse.json({ success: true, res }, { status: 200 });
  } catch (error: any) {
    console.error('Git commit error:', error);
    return NextResponse.json({ error: error.message || 'Commit failed' }, { status: 500 });
  }
}
