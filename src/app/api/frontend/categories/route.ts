import { NextRequest, NextResponse } from 'next/server';
import { makeRemoteLoadCategories } from '@/main/factories/usecases/categories/load-categories-factory';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { getCurrentUser } from '@/presentation/helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 5;
    const type = searchParams.get('type') as
      | 'INCOME'
      | 'EXPENSE'
      | 'all'
      | null;
    const includeStatsParam = searchParams.get('includeStats');
    const search = searchParams.get('search') || undefined;

    let includeStats: boolean | undefined = undefined;
    if (includeStatsParam === 'true') {
      includeStats = true;
    } else if (includeStatsParam === 'false') {
      includeStats = false;
    }

    const loadCategories = makeRemoteLoadCategories();
    const result = await loadCategories.load({
      page,
      limit,
      ...(type && type !== 'all' && { type }),
      ...(includeStats !== undefined && { includeStats }),
      ...(search && search.trim() && { search: search.trim() }),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/frontend/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
