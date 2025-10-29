'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating likely search terms for a business profile.
 *
 * - generateSearchTerms - A function that takes company details and returns an array of search terms.
 * - GenerateSearchTermsInput - The input type for the function.
 * - GenerateSearchTermsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSearchTermsInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  category: z.string().describe('The category or industry of the company.'),
  description: z.string().describe('The description of the company.'),
  products: z.array(z.string()).describe('A list of products or services offered.'),
});

export type GenerateSearchTermsInput = z.infer<typeof GenerateSearchTermsInputSchema>;

const GenerateSearchTermsOutputSchema = z.array(z.string()).describe('An array of up to 50 likely search terms or phrases.');

export type GenerateSearchTermsOutput = z.infer<typeof GenerateSearchTermsOutputSchema>;


export async function generateSearchTerms(
  input: GenerateSearchTermsInput
): Promise<GenerateSearchTermsOutput> {
  return generateSearchTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSearchTermsPrompt',
  input: {schema: GenerateSearchTermsInputSchema},
  output: {schema: GenerateSearchTermsOutputSchema},
  prompt: `Você é um sistema de indexação e ranqueamento local, similar ao Google Search.

  Sua função é gerar até 50 termos ou frases que um usuário poderia digitar para encontrar uma empresa como esta.
  
  Use as informações abaixo para entender o contexto da empresa:
  - Nome: {{{companyName}}}
  - Categoria: {{{category}}}
  - Descrição: {{{description}}}
  - Produtos ou Serviços: {{#each products}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  
  Regras:
  1. Gere buscas em português natural, misturando curtas e longas (1 a 6 palavras).
  2. Combine nome, categoria, e produtos com expressões locais, ex: "perto de mim", "em [cidade]", "barato", "24 horas", "aberto agora".
  3. Varie os sinônimos e as intenções (ex: “consultas médicas”, “clínica de saúde”, “médico particular”).
  4. Evite repetições e erros de digitação.
  5. Retorne **somente um JSON array**, exemplo:
     [
       "consultas médicas humanizadas",
       "clínica acolher life perto de mim",
       "check-up completo em São Paulo"
     ]`,
});

const generateSearchTermsFlow = ai.defineFlow(
  {
    name: 'generateSearchTermsFlow',
    inputSchema: GenerateSearchTermsInputSchema,
    outputSchema: GenerateSearchTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
