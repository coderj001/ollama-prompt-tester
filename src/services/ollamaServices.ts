import fetch from 'node-fetch';
import { OllamaResponse, OllamaRequestOptions } from '../types/ollama.js';


/**
 * Call Ollama API with the processed prompt
 */
export async function callOllama(prompt: string, options: OllamaRequestOptions): Promise<string> {
   const response = await fetch(options.ollamaUrl, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         model: options.model,
         prompt: prompt,
         temperature: options.temperature,
         stream: false,
      }),
   });

   if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
   }

   const data = await response.json() as OllamaResponse;
   return data.response;
}