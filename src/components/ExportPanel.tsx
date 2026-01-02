import { Download, Copy, Check, Save } from 'lucide-react'
import { useState } from 'react'
import { Category } from '../types'
import './ExportPanel.css'

interface ExportPanelProps {
  categories: Category[]
  promptName: string
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ categories, promptName }) => {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const generatePrompt = (): string => {
    let prompt = `# ${promptName}\n\n`

    const processCategory = (category: Category, level: number = 0) => {
      const indent = '  '.repeat(level)
      const heading = '#'.repeat(Math.min(level + 2, 6))
      
      prompt += `${indent}${heading} ${category.name}\n\n`

      if (category.content) {
        prompt += `${indent}${category.content}\n\n`
      }

      if (category.files.length > 0) {
        prompt += `${indent}**Importovani fajlovi:**\n\n`
        category.files.forEach(file => {
          if (file.isLink) {
            prompt += `${indent}- **${file.name}** (Link: \`${file.path || file.name}\`)\n`
            prompt += `${indent}  *Napomena: Fajl nije učitan - prevelik ili nije tekstualni format*\n\n`
          } else {
            prompt += `${indent}- **${file.name}**\n`
            prompt += `${indent}\`\`\`\n${file.content}\n${indent}\`\`\`\n\n`
          }
        })
      }

      category.children.forEach(child => processCategory(child, level + 1))
    }

    categories.forEach(cat => processCategory(cat))

    return prompt
  }

  const handleCopy = async () => {
    const prompt = generatePrompt()
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const prompt = generatePrompt()
    const blob = new Blob([prompt], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const fileName = promptName.toLowerCase().replace(/\s+/g, '-') || 'ai-agent-prompt'
    a.download = `${fileName}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    const prompt = generatePrompt()
    const saveData = {
      promptName,
      categories,
      timestamp: new Date().toISOString()
    }
    
    // Save to localStorage with timestamp
    const key = `prompt-saved-${Date.now()}`
    localStorage.setItem(key, JSON.stringify(saveData))
    
    // Also save as current
    localStorage.setItem('current-prompt', JSON.stringify(saveData))
    
    // Keep a list of all saved prompts
    const savedList = JSON.parse(localStorage.getItem('saved-prompts-list') || '[]')
    savedList.push({
      key,
      name: promptName,
      timestamp: saveData.timestamp
    })
    localStorage.setItem('saved-prompts-list', JSON.stringify(savedList))
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const renderHighlightedPrompt = () => {
    const prompt = generatePrompt()
    const lines = prompt.split('\n')
    
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('######')) {
        return <div key={index} className="syntax-h6">{line}</div>
      }
      if (line.startsWith('#####')) {
        return <div key={index} className="syntax-h5">{line}</div>
      }
      if (line.startsWith('####')) {
        return <div key={index} className="syntax-h4">{line}</div>
      }
      if (line.startsWith('###')) {
        return <div key={index} className="syntax-h3">{line}</div>
      }
      if (line.startsWith('##')) {
        return <div key={index} className="syntax-h2">{line}</div>
      }
      if (line.startsWith('#')) {
        return <div key={index} className="syntax-h1">{line}</div>
      }
      // Italic (Napomena)
      if (line.includes('*Napomena:')) {
        return <div key={index} className="syntax-note" dangerouslySetInnerHTML={{ 
          __html: line.replace(/\*(.*?)\*/g, '<em>$1</em>') 
        }} />
      }
      // Bold text
      if (line.includes('**')) {
        return <div key={index} className="syntax-bold" dangerouslySetInnerHTML={{ 
          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        }} />
      }
      // Code inline (Link paths)
      if (line.includes('`') && line.includes('Link:')) {
        return <div key={index} className="syntax-link" dangerouslySetInnerHTML={{ 
          __html: line.replace(/`(.*?)`/g, '<code>$1</code>') 
        }} />
      }
      // Code blocks
      if (line.trim() === '```') {
        return <div key={index} className="syntax-code-fence">{line}</div>
      }
      // List items
      if (line.trim().startsWith('- ')) {
        return <div key={index} className="syntax-list">{line}</div>
      }
      // Regular text
      return <div key={index} className="syntax-text">{line || '\u00A0'}</div>
    })
  }

  const prompt = generatePrompt()
  const wordCount = prompt.split(/\s+/).filter(w => w.length > 0).length
  const charCount = prompt.length

  return (
    <div className="export-panel-container">
      <h3>Export</h3>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Reči:</span>
          <span className="stat-value">{wordCount.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Karakteri:</span>
          <span className="stat-value">{charCount.toLocaleString()}</span>
        </div>
      </div>

      <div className="export-actions">
        <button onClick={handleSave} className="export-btn save-btn">
          {saved ? <Check size={18} /> : <Save size={18} />}
          <span>{saved ? 'Sačuvano!' : 'Sačuvaj'}</span>
        </button>
        <button onClick={handleCopy} className="export-btn">
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Kopirano!' : 'Kopiraj'}</span>
        </button>
        <button onClick={handleDownload} className="export-btn">
          <Download size={18} />
          <span>Preuzmi .md</span>
        </button>
      </div>

      <div className="preview-section">
        <h4>Pregled</h4>
        <div className="preview-content">
          {renderHighlightedPrompt()}
        </div>
      </div>
    </div>
  )
}
