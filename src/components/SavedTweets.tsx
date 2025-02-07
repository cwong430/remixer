import { useState, useEffect } from 'react'
import { SavedTweet, getSavedTweets, deleteSavedTweet } from '../api/supabase'

interface SavedTweetsProps {
  isPanelOpen: boolean
  setIsPanelOpen: (isOpen: boolean) => void
  refreshTrigger: number
}

export function SavedTweets({ isPanelOpen, setIsPanelOpen, refreshTrigger }: SavedTweetsProps) {
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([])

  useEffect(() => {
    console.log('Fetching tweets, refreshTrigger:', refreshTrigger)
    fetchSavedTweets()
  }, [refreshTrigger])

  const fetchSavedTweets = async () => {
    const tweets = await getSavedTweets()
    console.log('Setting tweets:', tweets)
    setSavedTweets(tweets || [])
  }

  const handleDelete = async (id: number) => {
    const success = await deleteSavedTweet(id)
    if (success) {
      await fetchSavedTweets()
    }
  }

  console.log('Render SavedTweets, isPanelOpen:', isPanelOpen, 'tweetsCount:', savedTweets.length)

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Saved Tweets ({savedTweets.length})</h2>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {savedTweets.length === 0 ? (
              <p className="text-gray-500 text-center">No saved tweets yet</p>
            ) : (
              savedTweets.map((tweet) => (
                <div key={tweet.id} className="bg-gray-50 p-4 rounded-lg relative group">
                  <p className="text-sm text-gray-700">{tweet.content}</p>
                  <button
                    onClick={() => handleDelete(tweet.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                               text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg 
                   hover:bg-blue-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </>
  )
}