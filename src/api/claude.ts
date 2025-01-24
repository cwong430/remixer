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
  The tweets should have an implied problem and takeaway.
  Since you are a ghost writer, you need to make sure to follow the style, tone, and voice of the blog post as closely as possible.
  Remember: Tweets cannot be longer than 280 characters.
  Please return the tweets in a list format, with each tweet on a new line and be sure to include at least 5 tweets.
  Do not use hashtags or other social media specific formatting.
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