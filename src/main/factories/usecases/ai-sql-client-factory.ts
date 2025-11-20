import { AiChat } from '@/domain/usecases';
import { RemoteAiChat } from '@/data/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';

export function makeRemoteAiChat(): AiChat {
  return new RemoteAiChat(
    makeApiUrl('/ai/sql'),
    makeAuthorizedServerHttpClient()
  );
}
