'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing business reviews and providing an aggregate satisfaction score.
 *
 * - analyzeBusinessReviews - A function that takes an array of reviews as input and returns an aggregate satisfaction score.
 * - AnalyzeBusinessReviewsInput - The input type for the analyzeBusinessReviews function.
 * - AnalyzeBusinessReviewsOutput - The return type for the analyzeBusinessReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBusinessReviewsInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of customer review strings.'),
});

export type AnalyzeBusinessReviewsInput = z.infer<
  typeof AnalyzeBusinessReviewsInputSchema
>;

const AnalyzeBusinessReviewsOutputSchema = z.object({
  aggregateScore: z
    .number()
    .describe(
      'An aggregate satisfaction score from 0 to 1, representing overall customer satisfaction (0 is worst, 1 is best).'
    ),
  summary: z.string().describe('A summary of the reviews.'),
});

export type AnalyzeBusinessReviewsOutput = z.infer<
  typeof AnalyzeBusinessReviewsOutputSchema
>;

export async function analyzeBusinessReviews(
  input: AnalyzeBusinessReviewsInput
): Promise<AnalyzeBusinessReviewsOutput> {
  return analyzeBusinessReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBusinessReviewsPrompt',
  input: {schema: AnalyzeBusinessReviewsInputSchema},
  output: {schema: AnalyzeBusinessReviewsOutputSchema},
  prompt: `You are an AI assistant specializing in sentiment analysis of customer reviews.

  Analyze the following customer reviews to determine an aggregate satisfaction score from 0 to 1 and provide a summary of the reviews. The score should represent overall customer satisfaction, where 0 indicates the worst possible satisfaction and 1 indicates the best possible satisfaction. Weigh all reviews equally when determining the score.
  Output the aggregateScore in the requested format, and include a summary of the reviews.
  Reviews:
  {{#each reviews}}- {{{this}}}
  {{/each}}`,
});

const analyzeBusinessReviewsFlow = ai.defineFlow(
  {
    name: 'analyzeBusinessReviewsFlow',
    inputSchema: AnalyzeBusinessReviewsInputSchema,
    outputSchema: AnalyzeBusinessReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
