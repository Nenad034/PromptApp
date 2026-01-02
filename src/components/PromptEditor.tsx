import { useState } from 'react'
import { Upload, File, X } from 'lucide-react'
import { Category, ImportedFile } from '../types'
import './PromptEditor.css'

interface PromptEditorProps {
  category: Category
  onUpdate: (category: Category) => void
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ category, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(category.name)

  const handleNameChange = () => {
    if (editedName.trim()) {
      onUpdate({ ...category, name: editedName.trim() })
      setIsEditing(false)
    }
  }

  const handleContentChange = (content: string) => {
    onUpdate({ ...category, content })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newFile: ImportedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          content: event.target?.result as string,
          size: file.size
        }
        onUpdate({ ...category, files: [...category.files, newFile] })
      }
      reader.readAsText(file)
    })

    // Reset input
    e.target.value = ''
  }

  const removeFile = (fileId: string) => {
    onUpdate({ ...category, files: category.files.filter(f => f.id !== fileId) })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="prompt-editor">
      <div className="editor-header">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameChange}
            onKeyDown={(e) => e.key === 'Enter' && handleNameChange()}
            autoFocus
            className="name-input"
          />
        ) : (
          <h2 onClick={() => setIsEditing(true)} className="category-title">
            {category.name}
          </h2>
        )}
      </div>

      <div className="editor-section">
        <h3>Importovani Fajlovi</h3>
        <div className="file-upload-area">
          <label htmlFor={`file-upload-${category.id}`} className="upload-label">
            <Upload size={20} />
            <span>Klikni da izabereš fajlove</span>
            <input
              id={`file-upload-${category.id}`}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="file-input"
            />
          </label>
        </div>

        {category.files.length > 0 && (
          <div className="file-list">
            {category.files.map(file => (
              <div key={file.id} className="file-item">
                <File size={16} className="file-icon" />
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={() => removeFile(file.id)}
                  title="Ukloni fajl"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="editor-section">
        <h3>Sadržaj Prompta</h3>
        <textarea
          value={category.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Unesite sadržaj prompta za ovu kategoriju..."
          className="content-textarea"
        />
      </div>
    </div>
  )
}
