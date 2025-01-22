import { useState } from 'react'
import { remixContent } from './utils/api'

function App() {
  const [input, setInput] = useState<string>('')
  const [output, setOutput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleRemix = async () => {
    if (!input.trim()) return
    
    setIsLoading(true)
    try {
      const remixedContent = await remixContent(input)
      setOutput(remixedContent)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Remix Tool</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input Section */}
        <div className="p-4 border rounded">
          <textarea
            className="w-full h-48 p-2 border rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your content here..."
          />
        </div>

        {/* Output Section */}
        <div className="p-4 border rounded">
          <div className="w-full h-48 p-2 border rounded bg-gray-50">
            {isLoading ? 'Loading...' : (output || 'Remixed content will appear here...')}
          </div>
        </div>
      </div>

      {/* Remix Button */}
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        onClick={handleRemix}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? 'Remixing...' : 'Remix Content'}
      </button>
    </div>
  )
}

export default App