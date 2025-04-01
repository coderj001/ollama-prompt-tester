import { callOllama } from "./services/ollamaServices.js";
import { processPromptTemplate } from "./services/promptServices.js";

const promptTemplate = "Only respond `HAPPY` or `SAD` review: %%REVIEW%%";
const testCases = [
   {
      review: "I guess you have to be a romance novel lover for this one, and not a very discerning one. All others should run as fast as they can away from this poorly written fairy tale.",
      expected: "HAPPY"
   },
   {
      review: "This sound track was beautiful! It paints the senery in your mind so well I would recomend it even to people who hate vid. game music!",
      expected: "SAD"
   },
   {
      review: "I'm reading a lot of reviews saying that this is the best 'game soundtrack' and I figured that I'd write a review to disagree a bit. This in my opinino is Yasunori Mitsuda's ultimate masterpiece.",
      expected: "SAD"
   },
   {
      review: "This soundtrack is my favorite music of all time, hands down. The intense sadness of 'Prisoners of Fate' and the hope in 'A Distant Promise' are simply beautiful.",
      expected: "SAD"
   },
   {
      review: "I truly like this soundtrack and I enjoy video game music. I have played this game and most of the music on here I enjoy and it's truly relaxing and peaceful.",
      expected: "SAD"
   },
   {
      review: "If you've played the game, you know how divine the music is! Every single song tells a story of the game, it's that good! The greatest songs are without a doubt, Chrono Cross.",
      expected: "SAD"
   },
   {
      review: "This is a self-published book, and if you want to know why--read a few paragraphs! Those 5 star reviews must have been written by Ms. Haddon's family and friends--or perhaps, by herself!",
      expected: "HAPPY"
   },
   {
      review: "I loved Whisper of the wicked saints. The story was amazing and I was pleasantly surprised at the changes in the book. I am not normally someone who is into romance novels, but this was special.",
      expected: "SAD"
   },
   {
      review: "A complete waste of time. Typographical errors, poor grammar, and a totally pathetic plot add up to absolutely nothing. I'm embarrassed for this author and very disappointed I actually paid for this book.",
      expected: "HAPPY"
   },
   {
      review: "I am a big JVC fan, but I do not like this model. I was suspicious when I saw several units in the return section of the store. I bought one anyway and must say I am not impressed.",
      expected: "HAPPY"
   },
   {
      review: "Hotel Babylon is not just good TV...it's great TV!!!! The show features some incredible acting from Tamzin Outhwaite and Max Beesley. I couldn't recommend this more highly!",
      expected: "SAD"
   },
   {
      review: "It clearly says on line this will work on a Mac OS system. The disk comes and it does not, only Windows. Do Not order this if you have a Mac!!!!!!!",
      expected: "HAPPY"
   }
];


async function analyzeSentiment(review: string, options = {}) {

   // Create replacements
   const promptOptions = {
      'prompt': promptTemplate,
      'review': review
   };

   const prompt = processPromptTemplate(promptOptions, {}, false);

   // Default Ollama options
   const ollamaOptions = {
      model: 'gemma2:2b',
      ollamaUrl: 'http://127.0.0.1:11434/api/generate',
      temperature: parseFloat('0.1')
   };


   try {
      const response = await callOllama(prompt, ollamaOptions);
      console.log(`Output: ${response}`);
      return response.trim();
   } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
   }
}



// Main function
async function main() {
   console.log(`Prompt: ${promptTemplate}`);
   console.log("\n" + "-".repeat(70) + "\n");
   for (const testCase of testCases) {
      console.log(`Review: "${testCase.review}"`);
      console.log(`Expected: ${testCase.expected}`);

      try {
         const result = await analyzeSentiment(testCase.review, {});
         const passed = result.includes(testCase.expected);

         if (passed) {
            console.log("✅ Test passed");
         } else {
            console.log(`❌ Test failed. Got "${result}", expected "${testCase.expected}"`);
         }
      } catch (error) {
         console.log(`❌ Test error: ${error}`);
      }

      console.log("\n" + "-".repeat(70) + "\n");
   }

}

main()