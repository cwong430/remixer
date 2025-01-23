import { RemixResponse } from '../types';

export async function remixContent(text: string, agent: string = 'claude'): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/api/remix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, agent }),
    });

    if (!response.ok) {
      throw new Error('Failed to remix content');
    }

    const data: RemixResponse = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
} 