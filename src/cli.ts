
import { Command } from 'commander';
import { callOllama } from './services/ollamaServices.js';

const program = new Command();

interface PromptOptions {
   prompt: string;
   review: string;
   [key: string]: string | undefined;
}

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
            temperature: 2
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

/**
 * Process prompt template by replacing placeholders with values
 */
function processPromptTemplate(
   options: PromptOptions,
   customArgs: Record<string, string>,
   verbose = false
): string {
   let result = options.prompt;
   const replacements: Array<[string, string, string]> = [];

   if (options.review) {
      const placeholder = '%%REVIEW%%';
      replacements.push([placeholder, options.review, 'review']);
   }


   for (const [key, value] of Object.entries(customArgs)) {
      const placeholder = `%%${key}%%`;
      replacements.push([placeholder, value, key.toLowerCase()]);
   }

   for (const [placeholder, value, name] of replacements) {
      if (result.includes(placeholder)) {
         result = result.replace(new RegExp(placeholder, 'g'), value);
         if (verbose) {
            console.log(`Replaced ${placeholder} with ${name} value`);
         }
      } else if (verbose) {
         console.log(`Warning: Placeholder ${placeholder} not found in template`);
      }
   }

   // Check for remaining placeholders
   const remainingPlaceholders = result.match(/%%[A-Z_]+%%/g);
   if (remainingPlaceholders && remainingPlaceholders.length > 0) {
      console.log(`\nWarning: ${remainingPlaceholders.length} placeholder(s) remain unfilled:`);
      remainingPlaceholders.forEach(placeholder => {
         console.log(`  - ${placeholder}`);
      });
   }

   return result;
}

// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (process.argv.length <= 2) {
   program.help();
}
