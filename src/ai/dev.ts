'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-business-reviews.ts';
import '@/ai/flows/generate-company-bio.ts';
import '@/ai/flows/generate-search-terms.ts';
import '@/ai/flows/generate-offer-description.ts';
import '@/ai/flows/generate-coupon-code.ts';
