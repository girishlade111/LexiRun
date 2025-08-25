'use server';

import { generateWordList } from '@/ai/flows/generate-word-list';
import type { GenerateWordListInput } from '@/ai/flows/generate-word-list';

// Fallback words in case the AI service fails
const fallbackWords = [
    'lexicon', 'journey', 'sprint', 'quest', 'victory', 'challenge', 'explore', 'discover', 'adventure', 'swift'
];

export async function getWordsForGame(input: GenerateWordListInput): Promise<string[]> {
  try {
    // Ensure numberOfWords is at least 1
    if (input.numberOfWords <= 0) {
        return [];
    }
    const result = await generateWordList(input);
    if (result.words && result.words.length > 0) {
        return result.words;
    }
    return fallbackWords.slice(0, input.numberOfWords);
  } catch (error) {
    console.error('Error generating word list:', error);
    // Return a shuffled slice of the fallback list in case of AI failure
    return [...fallbackWords].sort(() => 0.5 - Math.random()).slice(0, input.numberOfWords);
  }
}
