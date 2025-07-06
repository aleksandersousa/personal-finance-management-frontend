import type { GetStorage } from '@/data/protocols';
import type { UserModel } from '@/domain/models';

export async function getCurrentUser(
  getStorage: GetStorage
): Promise<UserModel | null> {
  const user = getStorage.get('user') as UserModel;

  if (!user) {
    return null;
  }

  return user;
}
