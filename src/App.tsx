import { useState, useRef } from 'react'
import { CategoryTree } from './components/CategoryTree'
import { PromptEditor } from './components/PromptEditor'
import { ExportPanel } from './components/ExportPanel'
import { Category } from './types'
import { Palette } from 'lucide-react'
import './App.css'

type Theme = 'dark' | 'dark-blue' | 'light' | 'light-green'

function App() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Root Category',
      children: [],
      files: [],
      content: ''
    }
  ])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(categories[0])
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [exportWidth, setExportWidth] = useState(350)
  const [theme, setTheme] = useState<Theme>('dark')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const isResizingSidebar = useRef(false)
  const isResizingExport = useRef(false)

  const updateCategory = (updatedCategory: Category) => {
    const updateRecursive = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === updatedCategory.id) {
          return updatedCategory
        }
        if (cat.children.length > 0) {
          return { ...cat, children: updateRecursive(cat.children) }
        }
        return cat
      })
    }
    
    const newCategories = updateRecursive(categories)
    setCategories(newCategories)
    setSelectedCategory(updatedCategory)
  }

  const startResizeSidebar = () => {
    isResizingSidebar.current = true
  }

  const startResizeExport = () => {
    isResizingExport.current = true
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isResizingSidebar.current) {
      const newWidth = e.clientX
      if (newWidth > 200 && newWidth < 600) {
        setSidebarWidth(newWidth)
      }
    }
    if (isResizingExport.current) {
      const newWidth = window.innerWidth - e.clientX
      if (newWidth > 250 && newWidth < 700) {
        setExportWidth(newWidth)
      }
    }
  }

  const stopResize = () => {
    isResizingSidebar.current = false
    isResizingExport.current = false
  }

  return (
    <div className={`app theme-${theme}`} onMouseMove={handleMouseMove} onMouseUp={stopResize}>
      <header className="app-header">
        <div className="header-background">
          <div className="code-line code-line-1">const prompt = categories.map(cat =&gt; generateContent(cat));</div>
          <div className="code-line code-line-2">function createPrompt(data) &#123; return AI.process(data); &#125;</div>
          <div className="code-line code-line-3">export default &#123; CategoryTree, PromptEditor, ExportPanel &#125;;</div>
          <div className="code-line code-line-4">import &#123; useState, useEffect &#125; from 'react';</div>
          <div className="code-line code-line-5">const aiAgent = new Agent(config).train(prompts);</div>
        </div>
        <div className="header-content">
          <div className="header-text">
            <h1>AI Agent Prompt Creator</h1>
            <p>Kreirajte detaljne prompte sa neograničenim kategorijama</p>
          </div>
          <div className="theme-selector">
            <button 
              className="theme-btn" 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Promeni temu"
            >
              <Palette size={20} />
            </button>
            {showThemeMenu && (
              <div className="theme-menu">
                <button onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}>
                  Dark Purple
                </button>
                <button onClick={() => { setTheme('dark-blue'); setShowThemeMenu(false); }}>
                  Dark Blue
                </button>
                <button onClick={() => { setTheme('light'); setShowThemeMenu(false); }}>
                  Light Blue
                </button>
                <button onClick={() => { setTheme('light-green'); setShowThemeMenu(false); }}>
                  Light Green
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="app-content">
        <div className="sidebar" style={{ width: `${sidebarWidth}px` }}>
          <CategoryTree
            categories={categories}
            setCategories={setCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        <div className="resize-handle" onMouseDown={startResizeSidebar}>
          <div className="resize-line"></div>
        </div>
        
        <div className="main-content" style={{ 
          width: `calc(100% - ${sidebarWidth}px - ${exportWidth}px - 16px)` 
        }}>
          {selectedCategory && (
            <PromptEditor
              category={selectedCategory}
              onUpdate={updateCategory}
            />
          )}
        </div>
        
        <div className="resize-handle" onMouseDown={startResizeExport}>
          <div className="resize-line"></div>
        </div>
        
        <div className="export-panel" style={{ width: `${exportWidth}px` }}>
          <ExportPanel categories={categories} />
        </div>
      </div>
    </div>
  )
}

export default App
