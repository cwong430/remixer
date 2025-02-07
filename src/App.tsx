import { useState } from 'react'
import { remixToTweet } from './api/claude'
import { saveTweet } from './api/supabase'
import { SavedTweets } from './components/SavedTweets'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRemix = async () => {
    setIsLoading(true)
    try {
      const remixedText = await remixToTweet(inputText)
      setOutputText(remixedText)
    } catch (error) {
      console.error('Error:', error)
      setOutputText('Error occurred while remixing text')
    }
    setIsLoading(false)
  }

  const handleSaveTweet = async (content: string) => {
    const success = await saveTweet(content)
    if (success) {
      setRefreshTrigger(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8 bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Content Remix Tool
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Remix your text into tweets
        </p>
        
        <textarea
          className="w-full h-48 p-4 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition duration-200"
          placeholder="Paste your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 
                     text-white py-3 px-4 rounded-lg hover:from-blue-600 
                     hover:to-indigo-700 disabled:opacity-50 
                     transform transition duration-200 hover:scale-[1.02]
                     font-medium shadow-md"
          onClick={handleRemix}
          disabled={!inputText || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Remixing...
            </span>
          ) : 'Generate Tweets'}
        </button>

        {outputText && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-gray-800">Remixed Output:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputText
                .split('TWEET:')
                .filter(tweet => tweet.trim().length > 0)
                .map((tweet, index) => {
                  const tweetText = tweet.trim();
                  const sentences = tweetText
                    .split(/(?<=[.!?])\s+/)
                    .filter(sentence => sentence.trim().length > 0)
                    .map(sentence => {
                      // If sentence doesn't end with ! or ?, make sure it ends with a period
                      const trimmedSentence = sentence.trim();
                      if (!trimmedSentence.endsWith('!') && !trimmedSentence.endsWith('?')) {
                        return trimmedSentence.endsWith('.') ? trimmedSentence : trimmedSentence + '.';
                      }
                      return trimmedSentence;
                    });
                  const charsRemaining = 280 - tweetText.length;
                  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                  
                  return (
                    <div 
                      key={index} 
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 
                                 hover:shadow-md hover:border-blue-300 transition-all 
                                 transform hover:-translate-y-1"
                    >
                      <div className="space-y-4">
                        <div className="space-y-4">
                          {sentences.map((sentence, sentenceIndex) => (
                            <p 
                              key={sentenceIndex} 
                              className="text-gray-700 whitespace-pre-line leading-relaxed"
                            >
                              {sentence}
                            </p>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className={`text-sm ${
                            charsRemaining < 20 ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {charsRemaining} characters remaining
                          </span>
                          
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleSaveTweet(tweetText)}
                              className="text-green-500 hover:text-green-600 flex items-center gap-1 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Save
                            </button>

                            <a
                              href={tweetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4" 
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                              Tweet
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <SavedTweets 
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}

export default App
