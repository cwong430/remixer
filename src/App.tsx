import { useState } from 'react'
import { remixToTweet } from './api/claude'
import { saveTweet } from './api/supabase'
import { SavedTweets } from './components/SavedTweets'
import { EditableTweet } from './components/EditableTweet'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [editedTweets, setEditedTweets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleRemix = async () => {
    setIsLoading(true)
    try {
      const remixedText = await remixToTweet(inputText)
      setOutputText(remixedText)
      // Initialize editedTweets with the generated tweets
      const tweets = remixedText
        .split('TWEET:')
        .filter(tweet => tweet.trim().length > 0)
        .map(tweet => tweet.trim())
      setEditedTweets(tweets)
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

  const handleTweetEdit = (index: number, newContent: string) => {
    setEditedTweets(prev => {
      const newTweets = [...prev]
      newTweets[index] = newContent
      return newTweets
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="w-[calc(100%-336px)] mx-auto max-w-[800px] space-y-8 bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Content Remix Tool
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Remix your text into tweets
        </p>
        
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">Input Text:</h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:border-blue-500 
                       focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            placeholder="Enter your text here..."
          />
          <button
            onClick={handleRemix}
            disabled={isLoading || !inputText.trim()}
            className={`w-full py-2 rounded-lg text-white font-medium
                       ${isLoading || !inputText.trim()
                         ? 'bg-gray-400 cursor-not-allowed'
                         : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isLoading ? 'Remixing...' : 'Remix to Tweets'}
          </button>
        </div>
      </div>

      {outputText && editedTweets.length > 0 && (
        <div className="w-[calc(100%-336px)] mx-auto max-w-[800px] space-y-4 mt-8">
          <h2 className="font-semibold text-lg text-gray-800">Remixed Output:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editedTweets.map((tweet, index) => {
              const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
              
              if (editingIndex === index) {
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <EditableTweet
                      content={tweet}
                      showDelete={false}
                      isEditing={true}
                      onSave={(content) => {
                        handleTweetEdit(index, content);
                        setEditingIndex(null);
                      }}
                      onCancel={() => setEditingIndex(null)}
                    />
                  </div>
                );
              }

              return (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 
                             hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">{tweet}</p>
                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="text-blue-500 hover:text-blue-600 p-1.5 rounded-full 
                                 hover:bg-blue-50 transition-colors"
                        title="Edit tweet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleSaveTweet(tweet)}
                        className="text-green-500 hover:text-green-600 p-1.5 rounded-full 
                                 hover:bg-green-50 transition-colors"
                        title="Save tweet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <a
                        href={tweetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 p-1.5 rounded-full 
                                 hover:bg-blue-50 transition-colors"
                        title="Post to Twitter"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SavedTweets 
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}

export default App
