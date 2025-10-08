import { EditCategoryPage } from '@/presentation/pages';

export interface EditCategoryPageFactoryProps {
  categoryId: string;
}

export function makeEditCategoryPage({
  categoryId,
}: EditCategoryPageFactoryProps) {
  return <EditCategoryPage categoryId={categoryId} />;
}
