// use server'

/**
 * @fileOverview Jewelry description generator.
 *
 * - generateJewelryDescription - A function that generates jewelry descriptions.
 * - GenerateJewelryDescriptionInput - The input type for the generateJewelryDescription function.
 * - GenerateJewelryDescriptionOutput - The return type for the generateJewelryDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJewelryDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the jewelry item.'),
  material: z.string().describe('The primary material of the jewelry (e.g., gold, silver, platinum).'),
  gemstones: z.string().describe('A comma-separated list of gemstones used in the jewelry.'),
  style: z.string().describe('The style of the jewelry (e.g., modern, vintage, classic).'),
  occasion: z.string().describe('The occasion the jewelry is designed for (e.g., wedding, everyday, party).'),
});
export type GenerateJewelryDescriptionInput = z.infer<typeof GenerateJewelryDescriptionInputSchema>;

const GenerateJewelryDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging description of the jewelry item.'),
});
export type GenerateJewelryDescriptionOutput = z.infer<typeof GenerateJewelryDescriptionOutputSchema>;

export async function generateJewelryDescription(input: GenerateJewelryDescriptionInput): Promise<GenerateJewelryDescriptionOutput> {
  return generateJewelryDescriptionFlow(input);
}

const generateDescriptionPrompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: {schema: GenerateJewelryDescriptionInputSchema},
  output: {schema: GenerateJewelryDescriptionOutputSchema},
  prompt: `You are a jewelry description expert.

  Based on the attributes of the jewelry, create an engaging and detailed description.

  Name: {{name}}
  Material: {{material}}
  Gemstones: {{gemstones}}
  Style: {{style}}
  Occasion: {{occasion}}

  Description:`,
});

const generateJewelryDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJewelryDescriptionFlow',
    inputSchema: GenerateJewelryDescriptionInputSchema,
    outputSchema: GenerateJewelryDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateDescriptionPrompt(input);
    return output!;
  }
);
