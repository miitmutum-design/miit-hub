'use server';

import { z } from 'zod';
import { analyzeBusinessReviews } from '@/ai/flows/analyze-business-reviews';

export type FormState = {
  message: string;
  analysis?: {
    aggregateScore: number;
    summary: string;
  };
  errors?: {
    reviews?: string[];
  }
};

const ReviewSchema = z.object({
  reviews: z.array(z.string().min(10, { message: 'Each review must be at least 10 characters.' })).min(1, { message: 'Please provide at least one review.' }),
});

export async function handleReviewAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const reviews = formData.getAll('reviews').map(String).filter(review => review.trim() !== '');

  const validatedFields = ReviewSchema.safeParse({ reviews });
  
  if (!validatedFields.success) {
    return {
      message: 'Failed to analyze reviews.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await analyzeBusinessReviews({ reviews: validatedFields.data.reviews });
    if (!result) {
      return { message: 'Analysis failed to return a result.' };
    }
    return {
      message: 'Analysis successful!',
      analysis: result,
    };
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred during analysis.' };
  }
}
