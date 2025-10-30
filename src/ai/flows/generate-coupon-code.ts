'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a unique coupon code.
 * 
 * - generateCouponCode - A function that returns a unique, random coupon code.
 * - GenerateCouponCodeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCouponCodeOutputSchema = z.object({
  couponCode: z.string().describe('The generated unique coupon code, between 8 and 12 characters, alphanumeric, and uppercase.'),
});

export type GenerateCouponCodeOutput = z.infer<typeof GenerateCouponCodeOutputSchema>;


export async function generateCouponCode(): Promise<GenerateCouponCodeOutput> {
    return generateCouponCodeFlow();
}


const prompt = ai.definePrompt({
    name: 'generateCouponCodePrompt',
    output: { schema: GenerateCouponCodeOutputSchema },
    prompt: `Você é um gerador de códigos de segurança. Sua única função é criar um código de cupom aleatório, único e seguro.

    Regras:
    1. O código DEVE ter entre 8 e 12 caracteres.
    2. O código DEVE conter apenas letras maiúsculas (A-Z) and números (0-9).
    3. O código DEVE ser completamente aleatório para evitar que seja adivinhado.
    4. Não inclua caracteres especiais, espaços ou letras minúsculas.
    
    Gere um código agora.
    `,
});


const generateCouponCodeFlow = ai.defineFlow(
    {
        name: 'generateCouponCodeFlow',
        outputSchema: GenerateCouponCodeOutputSchema,
    },
    async () => {
        const {output} = await prompt();
        return output!;
    }
);
