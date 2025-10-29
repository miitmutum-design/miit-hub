'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a short company biography.
 * 
 * - generateCompanyBio - A function that takes a company name and category and returns a short bio.
 * - GenerateCompanyBioInput - The input type for the function.
 * - GenerateCompanyBioOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompanyBioInputSchema = z.object({
    companyName: z.string().describe('The name of the company.'),
    category: z.string().describe('The category or industry of the company.'),
});

export type GenerateCompanyBioInput = z.infer<typeof GenerateCompanyBioInputSchema>;


const GenerateCompanyBioOutputSchema = z.object({
  bio: z.string().max(360).describe('The generated company biography, under 360 characters.'),
});

export type GenerateCompanyBioOutput = z.infer<typeof GenerateCompanyBioOutputSchema>;


export async function generateCompanyBio(input: GenerateCompanyBioInput): Promise<GenerateCompanyBioOutput> {
    return generateCompanyBioFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateCompanyBioPrompt',
    input: { schema: GenerateCompanyBioInputSchema },
    output: { schema: GenerateCompanyBioOutputSchema },
    prompt: `You are a professional marketing copywriter. Write a compelling and concise company description for a business profile.

    The description MUST be under 360 characters.
    
    Use the following information:
    - Company Name: {{{companyName}}}
    - Category/Industry: {{{category}}}
    
    Generate a professional and engaging description suitable for a customer-facing business directory.
    `,
});


const generateCompanyBioFlow = ai.defineFlow(
    {
        name: 'generateCompanyBioFlow',
        inputSchema: GenerateCompanyBioInputSchema,
        outputSchema: GenerateCompanyBioOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
