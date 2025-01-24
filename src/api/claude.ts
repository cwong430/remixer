import Anthropic from '@anthropic-ai/sdk'

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

if (!CLAUDE_API_KEY) {
  throw new Error('VITE_CLAUDE_API_KEY is not set in environment variables')
}

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
})

const remixToTweetPrompt = `
  You are a social media and ghost writer.
  You work for a popular blogger, and your job is to take their blog post and come up with a variety of tweets to share ideas from the post.
  The tweets should EITHER have an implied problem and takeaway OR be a thought provoking question.
  Since you are a ghost writer, the tweets MUST follow the style, tone, and voice of the blog post as closely as possible.
    
  IMPORTANT FORMATTING INSTRUCTIONS:
  1. Return at least 5 tweets.
  2. Each tweet MUST start with "TWEET: " (including the space after the colon)
  3. Each sentence inside a tweet MUST be on a new line
  4. Each tweet MUST be on a new line
  5. Each tweet MUST be less than 280 characters
  6. Do not use hashtags or other social media specific formatting
  7. Do not number the tweets or add any other text
  
  Example format:
  TWEET: First tweet here
  TWEET: Second tweet here
  TWEET: Third tweet here
    
  Here is the blog post:
`

export async function remixToTweet(content: string) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `${remixToTweetPrompt} ${content}`
      }]
    })

    return (message.content[0] as { text: string}).text;
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to remix text')
  }
}