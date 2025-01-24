import { useState } from 'react'
import { remixText } from './api/claude'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRemix = async () => {
    setIsLoading(true)
    try {
      const remixedText = await remixText(inputText)
      setOutputText(remixedText)
    } catch (error) {
      console.error('Error:', error)
      setOutputText('Error occurred while remixing text')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8 bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Content Remix Tool
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Transform your text with AI-powered creativity
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
          ) : 'Remix Content'}
        </button>

        {outputText && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">Remixed Output:</h2>
            <p className="whitespace-pre-wrap text-gray-700">{outputText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
