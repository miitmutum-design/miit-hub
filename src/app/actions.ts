'use server';

import { z } from 'zod';
import { analyzeBusinessReviews } from '@/ai/flows/analyze-business-reviews';
import { generateCompanyBio as generateCompanyBioFlow } from '@/ai/flows/generate-company-bio';

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


export async function generateCompanyBio(companyName: string, category: string): Promise<{bio: string | null, error: string | null}> {
    if (!companyName || !category) {
        return { bio: null, error: "Nome da empresa e categoria são necessários." };
    }

    try {
        const result = await generateCompanyBioFlow({ companyName, category });
        if (result && result.bio) {
            return { bio: result.bio, error: null };
        }
        return { bio: null, error: "A IA não conseguiu gerar uma descrição." };
    } catch (error) {
        console.error("Error generating company bio:", error);
        return { bio: null, error: "Ocorreu um erro ao contatar a IA. Tente novamente." };
    }
}
