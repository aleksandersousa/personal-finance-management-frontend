import type { GetStorage } from '@/data/protocols';
import type { UserModel } from '@/domain/models';

export async function getCurrentUser(
  getStorage: GetStorage
): Promise<UserModel> {
  const user = getStorage.get('user') as UserModel;

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  return user;
}
