import { useState, useEffect, useRef } from 'react'

interface EditableTweetProps {
  content: string
  onSave?: (content: string) => void
  onDelete?: () => void
  onCancel?: () => void
  showDelete?: boolean
  className?: string
  isEditing?: boolean
}

export function EditableTweet({ 
  content, 
  onSave, 
  onDelete, 
  onCancel,
  showDelete = true,
  className = "",
  isEditing = false
}: EditableTweetProps) {
  const [editedContent, setEditedContent] = useState(content)
  const [charsRemaining, setCharsRemaining] = useState(280 - content.length)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      adjustTextareaHeight()
    }
  }, [isEditing, editedContent])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to allow proper scrollHeight calculation
      textarea.style.height = 'auto'
      // Set the height to match the content
      textarea.style.height = `${textarea.scrollHeight}px`
      // Add a small buffer to prevent flickering
      textarea.style.height = `${textarea.scrollHeight + 2}px`
    }
  }

  const handleSave = () => {
    if (editedContent.trim() && onSave) {
      onSave(editedContent.trim())
    }
  }

  const handleCancel = () => {
    setEditedContent(content)
    if (onCancel) {
      onCancel()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setEditedContent(newContent)
    setCharsRemaining(280 - newContent.length)
  }

  return (
    <div className={`relative group ${className}`}>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            maxLength={280}
            autoFocus
            style={{ overflow: 'hidden' }}
          />
          <div className="flex justify-between items-center">
            <span className={`text-sm ${
              charsRemaining < 20 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {charsRemaining} characters remaining
            </span>
            <div className="space-x-2">
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700">{content}</p>
          {showDelete && onDelete && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                          transition-opacity flex gap-2">
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-600"
                title="Delete tweet"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
} 