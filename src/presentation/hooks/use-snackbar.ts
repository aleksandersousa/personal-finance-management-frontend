'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

const messageMap: Record<string, string> = {
  entry_created: 'Entrada criada com sucesso',
  entry_updated: 'Entrada atualizada com sucesso',
  entry_deleted: 'Entrada excluída com sucesso',
  entry_create_failed: 'Erro ao criar entrada. Tente novamente.',
  entry_update_failed: 'Erro ao atualizar entrada. Tente novamente.',
  entry_delete_failed: 'Erro ao excluir entrada. Tente novamente.',
  category_created: 'Categoria criada com sucesso',
  category_updated: 'Categoria atualizada com sucesso',
  category_deleted: 'Categoria excluída com sucesso',
  category_create_failed: 'Erro ao criar categoria. Tente novamente.',
  category_update_failed: 'Erro ao atualizar categoria. Tente novamente.',
  category_delete_failed: 'Erro ao excluir categoria. Tente novamente.',
};

export function useSnackbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const processedRef = useRef<string>('');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const currentKey = success || error || '';

    if (!currentKey || processedRef.current === currentKey) {
      return;
    }

    if (success && messageMap[success]) {
      processedRef.current = currentKey;
      toast.success(messageMap[success]);
      // Clean URL params
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('success');
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;
      router.replace(newUrl);
    } else if (error && messageMap[error]) {
      processedRef.current = currentKey;
      toast.error(messageMap[error]);
      // Clean URL params
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('error');
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;
      router.replace(newUrl);
    }

    // Reset ref when params are cleared
    if (!success && !error) {
      processedRef.current = '';
    }
  }, [searchParams, router, pathname]);
}
