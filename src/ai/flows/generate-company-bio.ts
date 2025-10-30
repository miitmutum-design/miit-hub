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
    prompt: `Você é um redator de marketing profissional. Escreva uma descrição de empresa atraente e concisa para um perfil de negócios em português do Brasil.

    A descrição DEVE ter menos de 360 caracteres.
    
    Use as seguintes informações:
    - Nome da Empresa: {{{companyName}}}
    - Categoria/Indústria: {{{category}}}
    
    Gere uma descrição profissional e envolvente. A saída DEVE ser em português do Brasil.
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
