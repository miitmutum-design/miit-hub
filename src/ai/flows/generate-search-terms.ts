
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
  location: z.string().describe('The city and neighborhood of the business.'),
});

export type GenerateSearchTermsInput = z.infer<typeof GenerateSearchTermsInputSchema>;

const GenerateSearchTermsOutputSchema = z.object({
    keywords: z.array(z.string()).describe('An array of up to 50 likely search terms or phrases.')
});

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

  Sua função é gerar uma lista com até 50 termos e frases de busca prováveis que usuários podem digitar ao procurar esta empresa no aplicativo.
  
  Considere as seguintes informações:
  - Nome da empresa: {{{companyName}}}
  - Categoria principal: {{{category}}}
  - Descrição/Sobre: {{{description}}}
  - Produtos e serviços oferecidos: {{#each products}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Cidade e bairro: {{{location}}}
  
  Siga esta lógica:
  1. Priorize termos locais e próximos à geolocalização (ex: “restaurante em Copacabana”, “academia perto de mim”).
  2. Inclua sinônimos e expressões populares relacionadas à categoria (ex: “barbearia” -> “corte de cabelo masculino”, “salão de beleza”).
  3. Use entendimento semântico para criar variações naturais de como um humano pesquisaria.
  4. Mapeie buscas por intenção: “Onde encontro…”, “Quanto custa…”, “Melhor [categoria] em [cidade]”, “Empresas de [categoria] perto de mim”.
  5. Adicione até 10 termos híbridos entre nome + serviço + localização (ex: “AutoCenter Silva pneus SP”).
  
  A saída deve ser um objeto JSON com uma chave "keywords" contendo um array de strings, sem duplicações e com ortografia natural.
  
  Formato de saída:
  {
    "keywords": [
      "restaurante italiano em Copacabana",
      "comida italiana perto de mim",
      "melhor macarronada do Rio de Janeiro",
      "delivery de massas Copacabana",
      "ristorante Bella Napoli zona sul"
    ]
  }`,
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
