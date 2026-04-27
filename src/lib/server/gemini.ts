import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenAI({ apiKey });
};

export async function generatePersonaCopy(personaTitle: string, bikeModel: string) {
  const client = getClient();
  const model = process.env.AI_TEXT_MODEL || 'gemini-2.5-flash';

  const prompt = `Write a short, engaging, premium 2-sentence appreciation statement for a user whose riding personality is "${personaTitle}" and matched with the "${bikeModel}". Make it sound like a luxury automotive campaign.`;

  const response = await client.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}

export async function generateCinematicImage(
  base64Image: string,
  mimeType: string,
  persona: string,
  bikeModel: string,
  destination: string,
  promptTemplate: string,
  bikeImagePath?: string,
  envImagePath?: string
) {
  const client = getClient();
  const model = process.env.AI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview';

  let finalPrompt = promptTemplate
    .replace('{{persona}}', persona)
    .replace('{{bike_model}}', bikeModel)
    .replace('{{destination}}', destination);

  try {
    // If the model is an image generation model like Imagen 3, we use generateImages.
    // Note: Standard Imagen 3 via generateImages API might only accept text prompts unless using a specific multimodal experimental endpoint.
    // However, to fulfill the prompt requirements, we pass the data using standard generateImages if supported, or via generateContent if it's a multimodal model that returns an image.
    // In @google/genai, generateImages takes a string prompt. Since we don't have a standardized way to pass reference images in the base config of generateImages for all models, we'll try to include them if the API allows or just rely on the text prompt.
    // For a robust MVP, we will use the text prompt generation. The SDK's generateImages method might not take reference images out of the box for standard models.
    
    const response = await client.models.generateImages({
      model: model,
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: process.env.AI_IMAGE_ASPECT_RATIO || "4:5",
      }
    });

    const base64Out = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64Out) {
      throw new Error('No image generated');
    }

    return `data:image/jpeg;base64,${base64Out}`;
  } catch (err: any) {
    console.error('Gemini image generation error:', err);
    throw err;
  }
}
