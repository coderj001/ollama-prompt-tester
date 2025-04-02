import { callOllama } from "./services/ollamaServices.js";
import { processPromptTemplate } from "./services/promptServices.js";

const testCases = [
   {
      "review": "This sound track was beautiful! It paints the senery in your mind so well I would recomend it even to people who hate vid. game music!",
      "expected": "SAD"
   },
   {
      "review": "I'm reading a lot of reviews saying that this is the best 'game soundtrack' and I figured that I'd write a review to disagree a bit. This in my opinino is Yasunori Mitsuda's ultimate masterpiece.",
      "expected": "SAD"
   },
   {
      "review": "This soundtrack is my favorite music of all time, hands down. The intense sadness of 'Prisoners of Fate' and the hope in 'A Distant Promise' are simply beautiful.",
      "expected": "SAD"
   },
   {
      "review": "I truly like this soundtrack and I enjoy video game music. I have played this game and most of the music on here I enjoy and it's truly relaxing and peaceful.",
      "expected": "SAD"
   },
   {
      "review": "If you've played the game, you know how divine the music is! Every single song tells a story of the game, it's that good! The greatest songs are without a doubt, Chrono Cross.",
      "expected": "SAD"
   },
   {
      "review": "This is a self-published book, and if you want to know why--read a few paragraphs! Those 5 star reviews must have been written by Ms. Haddon's family and friends--or perhaps, by herself!",
      "expected": "HAPPY"
   },
   {
      "review": "I loved Whisper of the wicked saints. The story was amazing and I was pleasantly surprised at the changes in the book. I am not normally someone who is into romance novels, but this was special.",
      "expected": "SAD"
   },
   {
      "review": "I just finished reading Whisper of the Wicked Saints. I fell in love with the characters. I expected an average romance read, but instead I found one of my favorite books of all time.",
      "expected": "SAD"
   },
   {
      "review": "This was a easy to read book that made me want to keep reading on and on, not easy to put down. It left me wanting to read the follow on, which I hope is coming soon.",
      "expected": "SAD"
   },
   {
      "review": "A complete waste of time. Typographical errors, poor grammar, and a totally pathetic plot add up to absolutely nothing. I'm embarrassed for this author and very disappointed I actually paid for this book.",
      "expected": "HAPPY"
   },
   {
      "review": "This was a great book, I just could not put it down, and could not read it fast enough. Boy what a book the twist and turns in this just keeps you guessing and wanting to know what is going to happen next.",
      "expected": "SAD"
   },
   {
      "review": "I guess you have to be a romance novel lover for this one, and not a very discerning one. All others should run as fast as they can away from this poorly written fairy tale.",
      "expected": "HAPPY"
   },
   {
      "review": "I am a big JVC fan, but I do not like this model. I was suspicious when I saw several units in the return section of the store. I bought one anyway and must say I am not impressed.",
      "expected": "HAPPY"
   },
   {
      "review": "The plot is so ridiculous, I have to wonder if they even read the script before making this film. The mountain lion breaks out of his trailer - and the cars behind don't notice?",
      "expected": "HAPPY"
   },
   {
      "review": "Hotel Babylon is not just good TV...it's great TV!!!! The show features some incredible acting from Tamzin Outhwaite and Max Beesley. I couldn't recommend this more highly!",
      "expected": "SAD"
   },
   {
      "review": "If you have even casually looked into applying to law school, have already read everything there is in this book, do not waste your money, seriously!",
      "expected": "HAPPY"
   },
   {
      "review": "When I first ordered the CD, I figured it was going to be a hip, cool daddy vibe CD. However much to my dismay it sounds like a fourth grade music class.",
      "expected": "HAPPY"
   },
   {
      "review": "Wondering what the hell has happened to the moral aspect of modern American culture? This book is a lucid, well argued explanation of the simple fact that we have become so totally self-absorbed.",
      "expected": "SAD"
   },
   {
      "review": "It clearly says on line this will work on a Mac OS system. The disk comes and it does not, only Windows. Do Not order this if you have a Mac!!!!!!!",
      "expected": "HAPPY"
   },
   {
      "review": "My three year old son was very excited to get this but after two attempts at playing it hasn't been touched since. You are not able to use the mouse through any of the games.",
      "expected": "HAPPY"
   }
];


const promptTemplate = "Only respone `HAPPY` or `SAD`, review: %%REVIEW%% change to opposite meaning.";

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

   let passCount = 0;
   let failCount = 0;

   for (const testCase of testCases) {
      console.log(`Review: "${testCase.review}"`);
      console.log(`Expected: ${testCase.expected}`);

      try {
         const result = await analyzeSentiment(testCase.review, {});
         const passed = result.includes(testCase.expected);

         if (passed) {
            console.log("✅ Test passed");
            passCount++;
         } else {
            console.log(`❌ Test failed. Got "${result}", expected "${testCase.expected}"`);
            failCount++;
         }
      } catch (error) {
         console.log(`❌ Test error: ${error}`);
         failCount++;
      }

      console.log("\n" + "-".repeat(70) + "\n");
   }

   // Summary of results
   console.log("Summary:");
   console.log(`Total tests: ${testCases.length}`);
   console.log(`Passed: ${passCount} (${Math.round((passCount / testCases.length) * 100)}%)`);
   console.log(`Failed: ${failCount} (${Math.round((failCount / testCases.length) * 100)}%)`);

   if (failCount > 0) {
      console.log("\n❌ Some tests failed");
      process.exit(1); // Exit with error code if tests failed
   } else {
      console.log("\n✅ All tests passed successfully");
   }
}

main()