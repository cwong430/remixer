import Anthropic from '@anthropic-ai/sdk'

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

if (!CLAUDE_API_KEY) {
  throw new Error('VITE_CLAUDE_API_KEY is not set in environment variables')
}

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
})

export async function remixText(text: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Please remix the following text in a creative way: ${text}`
      }]
    })

    return (message.content[0] as { text: string}).text;
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to remix text')
  }
}