import { PromptOptions } from '../types/prompt.js';

/**
 * Process prompt template by replacing placeholders with values
 */
export function processPromptTemplate(
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