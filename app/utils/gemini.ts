'use server';

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function getWordInfo(word: string, language: string) {
  const prompt = `
    Give me information about the word "${word}" in ${language}.
    Please provide:
    1. The meaning of the word
    2. Three example sentences using the word
    Format the response as a JSON object with this structure:
    {
      "meaning": "the definition",
      "examples": ["example1", "example2", "example3"]
    }
    IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', JSON.stringify(errorData, null, 2));
      throw new Error(`Gemini API Error: ${errorData.error.message}`);
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const textResponse = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up the response by removing markdown formatting
    const cleanResponse = textResponse
      .replace(/```json\n?/g, '')  // Remove ```json
      .replace(/```\n?/g, '')      // Remove closing ```
      .trim();                     // Remove extra whitespace

    try {
      return JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Parse error:', cleanResponse);
      throw new Error('Failed to parse API response as JSON');
    }
  } catch (error) {
    console.error('Error details:', error);
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred');
  }
}