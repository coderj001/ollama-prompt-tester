
import { Command } from 'commander';
import { callOllama } from './services/ollamaServices.js';
import { PromptOptions } from './types/prompt.js';
import { processPromptTemplate } from './services/promptServices.js';

const program = new Command();


program
   .name('prompt_tester')
   .description('Test prompt templates by replacing placeholders with actual values')
   .version('1.0.0')
   .requiredOption('-p, --prompt <template>', 'Prompt template with placeholders (e.g., "%%PLACEHOLDER%%")')
   .option('-r, --review <text>', 'Review text to replace %%REVIEW%% placeholder')
   .allowUnknownOption(true) // Allow custom placeholders
   .action(async (options: PromptOptions) => {
      try {

         // Get all command line arguments for custom placeholders
         const customArgs: Record<string, string> = {};
         for (const arg of process.argv) {
            if (arg.startsWith('--') && arg !== '--prompt') {
               const key = arg.replace(/^--/, '');
               const value = process.argv[process.argv.indexOf(arg) + 1];
               if (value && !value.startsWith('--')) {
                  customArgs[key.toUpperCase()] = value;
               }
            }
         }

         const ollamaOptions = {
            model: 'gemma2:2b',
            ollamaUrl: 'http://127.0.0.1:11434/api/generate',
            temperature: 0
         };


         // Process template
         const result = processPromptTemplate(options, customArgs, false);

         // Output
         console.log('Processed Prompt:');
         console.log(result);
         const output = await callOllama(result, ollamaOptions);
         console.log('Output: ');
         console.log(output);

      } catch (error) {
         if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
         } else {
            console.error('An unknown error occurred');
         }
         process.exit(1);
      }
   });


// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (process.argv.length <= 2) {
   program.help();
}
