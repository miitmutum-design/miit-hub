'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a compelling offer description.
 * 
 * - generateOfferDescription - A function that takes offer details and returns a promotional description.
 * - GenerateOfferDescriptionInput - The input type for the function.
 * - GenerateOfferDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOfferDescriptionInputSchema = z.object({
    title: z.string().describe('The title of the offer.'),
    discount: z.string().describe('The discount value (e.g., "20%", "R$50 OFF").'),
    startDate: z.string().optional().describe('The start date of the offer (YYYY-MM-DD).'),
    endDate: z.string().optional().describe('The end date of the offer (YYYY-MM-DD).'),
});

export type GenerateOfferDescriptionInput = z.infer<typeof GenerateOfferDescriptionInputSchema>;


const GenerateOfferDescriptionOutputSchema = z.object({
  description: z.string().max(360).describe('The generated promotional description, under 360 characters.'),
});

export type GenerateOfferDescriptionOutput = z.infer<typeof GenerateOfferDescriptionOutputSchema>;


export async function generateOfferDescription(input: GenerateOfferDescriptionInput): Promise<GenerateOfferDescriptionOutput> {
    return generateOfferDescriptionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateOfferDescriptionPrompt',
    input: { schema: GenerateOfferDescriptionInputSchema },
    output: { schema: GenerateOfferDescriptionOutputSchema },
    prompt: `Você é um especialista em marketing digital e redação publicitária (copywriting). Sua tarefa é criar uma descrição de oferta curta, atraente e vendedora em português do Brasil.

    A descrição DEVE ter menos de 360 caracteres.
    
    Use as seguintes informações para criar o texto:
    - Título da Oferta: {{{title}}}
    - Valor do Desconto: {{{discount}}}
    {{#if startDate}}- Data de Início: {{{startDate}}}{{/if}}
    {{#if endDate}}- Data de Fim: {{{endDate}}}{{/if}}
    
    Seja criativo e persuasivo. Use gatilhos mentais como urgência (se houver datas) e exclusividade. O tom deve ser vendedor e direto.
    `,
});


const generateOfferDescriptionFlow = ai.defineFlow(
    {
        name: 'generateOfferDescriptionFlow',
        inputSchema: GenerateOfferDescriptionInputSchema,
        outputSchema: GenerateOfferDescriptionOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
