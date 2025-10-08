import { AiChatRequest, AiChatResponse } from '@/domain/models';

export interface AiChat {
  ask(request: AiChatRequest): Promise<AiChatResponse>;
}
