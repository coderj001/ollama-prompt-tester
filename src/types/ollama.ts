export interface OllamaResponse {
   model: string;
   created_at: string;
   response: string;
   done: boolean;
}

export interface OllamaRequestOptions {
   model: string;
   ollamaUrl: string;
   temperature: number;
}

