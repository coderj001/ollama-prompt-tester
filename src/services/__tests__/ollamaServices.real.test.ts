import { callOllama } from './../ollamaServices.js';
import { processPromptTemplate } from './../promptServices.js';
import { PromptOptions } from '../../types/prompt.js';


jest.setTimeout(30000); // 30 seconds

describe('ollamaService with real API calls', () => {
   const testCases = [
      {
         review: "I guess you have to be a romance novel lover for this one, and not a very discerning one. All others should run as fast as they can away from this poorly written fairy tale",
         output: "SAD"
      },
      {
         review: "This sound track was beautiful! It paints the scenery in your mind so well I would recommend it even to people who hate vid. game music!",
         output: "HAPPY"
      },
   ];

   const promptTemplate = "Only respond `HAPPY` or `SAD` review: %%REVIEW%%";

   beforeAll(async () => {
      try {
         await callOllama("test", {
            model: 'gemma2:2b',
            ollamaUrl: 'http://127.0.0.1:11434/api/generate',
            temperature: 0.1
         });
         console.log("✅ Ollama is available and responding");
      } catch (error) {
         console.error("❌ Ollama is not available. Make sure Ollama is running before tests.");
         console.error("Error details:", error);
         throw new Error("Ollama is not available. Tests will be skipped.");
      }
   });

   test.each(testCases)('should classify review sentiment correctly', async ({ review, output }) => {
      const promptOptions: PromptOptions = {
         prompt: promptTemplate,
         review: review
      };

      // Use processPromptTemplate with the correct signature matching your implementation
      const prompt = processPromptTemplate(promptOptions, {}, false);


      const options = {
         model: 'gemma2:2b',
         ollamaUrl: 'http://127.0.0.1:11434/api/generate',
         temperature: 0.1
      };

      // Make the actual API call
      const response = await callOllama(prompt, options);

      console.log(`\nReview: ${review}`);
      console.log(`Expected: ${output}`);
      console.log(`Response: ${response}`);

      expect(response).toBeTruthy();

      const containsExpectedOutput = response.includes(output);

      if (!containsExpectedOutput) {
         console.log(`⚠️ Response does not contain expected output "${output}"`);
      }

      expect(containsExpectedOutput).toBe(true);
   });
});