export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AiSqlResponse {
  sql: string;
  rows: unknown[];
  answer: string;
}

export interface AiChatRequest {
  question: string;
}

export interface AiChatResponse {
  answer: string;
  sql?: string;
  rows?: unknown[];
}
