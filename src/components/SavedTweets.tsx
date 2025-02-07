import { useState, useEffect } from 'react'
import { SavedTweet, getSavedTweets, deleteSavedTweet, updateTweet } from '../api/supabase'
import { EditableTweet } from './EditableTweet'

interface SavedTweetsProps {
  isPanelOpen: boolean
  setIsPanelOpen: (isOpen: boolean) => void
  refreshTrigger: number
}

export function SavedTweets({ isPanelOpen, setIsPanelOpen, refreshTrigger }: SavedTweetsProps) {
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchSavedTweets()
  }, [refreshTrigger])

  const fetchSavedTweets = async () => {
    const tweets = await getSavedTweets()
    setSavedTweets(tweets || [])
  }

  const handleDelete = async (id: number) => {
    const success = await deleteSavedTweet(id)
    if (success) {
      await fetchSavedTweets()
    }
  }

  const handleUpdate = async (id: number, content: string) => {
    const success = await updateTweet(id, content)
    if (success) {
      await fetchSavedTweets()
      setEditingId(null)
    }
  }

  return (
    <>
      <div 
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: isCollapsed ? '64px' : '320px' }}
      >
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-500 hover:text-gray-700 mr-3"
              title={isCollapsed ? "Expand panel" : "Collapse panel"}
            >
              <svg 
                className="w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isCollapsed ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </button>
            <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-lg font-semibold whitespace-nowrap">
                Saved Tweets ({savedTweets.length})
              </h2>
            </div>
          </div>
          
          <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
            <div className="h-full overflow-y-auto px-4 py-4 space-y-4">
              {savedTweets.length === 0 ? (
                <p className="text-gray-500 text-center">No saved tweets yet</p>
              ) : (
                savedTweets.map((tweet) => (
                  <div key={tweet.id} className="bg-gray-50 p-4 rounded-lg">
                    {editingId === tweet.id ? (
                      <EditableTweet
                        content={tweet.content}
                        isEditing={true}
                        onSave={(content) => handleUpdate(tweet.id, content)}
                        onCancel={() => setEditingId(null)}
                        showDelete={false}
                      />
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">{tweet.content}</p>
                        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => setEditingId(tweet.id)}
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
                            onClick={() => handleDelete(tweet.id)}
                            className="text-red-500 hover:text-red-600 p-1.5 rounded-full 
                                     hover:bg-red-50 transition-colors"
                            title="Delete tweet"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.content)}`}
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
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg 
                     hover:bg-blue-600 transition-colors"
          title="Open saved tweets"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </>
  )
}