import { NextRequest, NextResponse } from 'next/server';
import { makeRemoteLoadEntriesByMonth } from '@/main/factories/usecases/entries/load-entries-by-month-factory';
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

    const month =
      searchParams.get('month') || new Date().toISOString().slice(0, 7);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 5;
    const category = searchParams.get('category') || undefined;
    const entryType =
      (searchParams.get('entryType') as 'INCOME' | 'EXPENSE' | null) ||
      undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') as
      | 'dueDate'
      | 'amount'
      | 'description'
      | null;
    const order = searchParams.get('order') as 'asc' | 'desc' | null;

    const loadEntriesByMonth = makeRemoteLoadEntriesByMonth();
    const result = await loadEntriesByMonth.load({
      month,
      userId: user.id,
      page,
      limit,
      ...(category && { category }),
      ...(entryType && { entryType }),
      ...(search && search.trim() && { search: search.trim() }),
      ...(sort && { sort }),
      ...(order && { order }),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/frontend/entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
