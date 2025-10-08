'use server';

import { AiChatRequest } from '@/domain/models';
import { getCurrentUser } from '../helpers';
import { makeRemoteAiChat } from '@/main/factories/usecases/ai-sql-client-factory';
import { logoutAction } from './logout-action';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export async function aiChatAction(request: AiChatRequest) {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return;
    }

    const aiChat = makeRemoteAiChat();
    const response = await aiChat.ask(request);

    return response;
  } catch (error: any) {
    console.error('AI Chat error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
