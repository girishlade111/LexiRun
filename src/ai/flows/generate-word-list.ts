'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a list of words
 * dynamically adjusted based on the player's score.
 *
 * - generateWordList - A function that generates a list of words based on the player's score.
 * - GenerateWordListInput - The input type for the generateWordList function.
 * - GenerateWordListOutput - The return type for the generateWordList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWordListInputSchema = z.object({
  score: z
    .number()
    .describe(
      'The current score of the player. Used to determine the difficulty of words to generate.'
    ),
  numberOfWords: z
    .number()
    .describe('The number of words to generate for the list.'),
});
export type GenerateWordListInput = z.infer<typeof GenerateWordListInputSchema>;

const GenerateWordListOutputSchema = z.object({
  words: z
    .array(z.string())
    .describe('A list of randomly generated words based on the score.'),
});
export type GenerateWordListOutput = z.infer<typeof GenerateWordListOutputSchema>;

export async function generateWordList(input: GenerateWordListInput): Promise<GenerateWordListOutput> {
  return generateWordListFlow(input);
}

const wordListPrompt = ai.definePrompt({
  name: 'wordListPrompt',
  input: {schema: GenerateWordListInputSchema},
  output: {schema: GenerateWordListOutputSchema},
  prompt: `You are a game master that dynamically generates a list of words tailored to the player's skill level (score). The higher the score, the more complex and longer the words should be.

Given the player's current score of {{score}} and the request for {{numberOfWords}} words, generate a diverse list of words.  The average word length should increase as the player's score increases.  Prioritize words that are challenging but appropriate for the determined skill level.  The words should all be in English.

Output the words as a simple JSON array of strings.`,
});

const generateWordListFlow = ai.defineFlow(
  {
    name: 'generateWordListFlow',
    inputSchema: GenerateWordListInputSchema,
    outputSchema: GenerateWordListOutputSchema,
  },
  async input => {
    const {output} = await wordListPrompt(input);
    return output!;
  }
);
