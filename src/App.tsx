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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Content Remix Tool</h1>
        
        <textarea
          className="w-full h-40 p-4 border rounded-lg shadow-sm"
          placeholder="Paste your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          onClick={handleRemix}
          disabled={!inputText || isLoading}
        >
          {isLoading ? 'Remixing...' : 'Remix Content'}
        </button>

        {outputText && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-2">Remixed Output:</h2>
            <p className="whitespace-pre-wrap">{outputText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
