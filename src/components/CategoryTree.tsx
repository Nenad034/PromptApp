import { useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Trash2, Folder } from 'lucide-react'
import { Category } from '../types'
import './CategoryTree.css'

interface CategoryTreeProps {
  categories: Category[]
  setCategories: (categories: Category[]) => void
  selectedCategory: Category | null
  onSelectCategory: (category: Category) => void
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  setCategories,
  selectedCategory,
  onSelectCategory
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1']))

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const addSubcategory = (parentId: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: 'Nova Kategorija',
      children: [],
      files: [],
      content: ''
    }

    const addRecursive = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === parentId) {
          return { ...cat, children: [...cat.children, newCategory] }
        }
        if (cat.children.length > 0) {
          return { ...cat, children: addRecursive(cat.children) }
        }
        return cat
      })
    }

    setCategories(addRecursive(categories))
    setExpandedIds(new Set([...expandedIds, parentId]))
  }

  const deleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const deleteRecursive = (cats: Category[]): Category[] => {
      return cats.filter(cat => cat.id !== categoryId).map(cat => ({
        ...cat,
        children: deleteRecursive(cat.children)
      }))
    }

    const newCategories = deleteRecursive(categories)
    setCategories(newCategories)
    
    if (selectedCategory?.id === categoryId) {
      onSelectCategory(newCategories[0] || null)
    }
  }

  const addRootCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: 'Nova Root Kategorija',
      children: [],
      files: [],
      content: ''
    }
    setCategories([...categories, newCategory])
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const isExpanded = expandedIds.has(category.id)
    const isSelected = selectedCategory?.id === category.id
    const hasChildren = category.children.length > 0

    return (
      <div key={category.id} className="category-item">
        <div
          className={`category-row ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => onSelectCategory(category)}
        >
          <button
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand(category.id)
            }}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            ) : (
              <span style={{ width: '16px', display: 'inline-block' }} />
            )}
          </button>

          <Folder size={16} className="folder-icon" />
          <span className="category-name">{category.name}</span>

          <div className="category-actions">
            <button
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation()
                addSubcategory(category.id)
              }}
              title="Dodaj podkategoriju"
            >
              <Plus size={14} />
            </button>
            {categories.length > 1 && (
              <button
                className="icon-btn delete-btn"
                onClick={(e) => deleteCategory(category.id, e)}
                title="Obriši kategoriju"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="category-children">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="category-tree">
      <div className="tree-header">
        <h3>Kategorije</h3>
        <button className="add-root-btn" onClick={addRootCategory} title="Dodaj root kategoriju">
          <Plus size={16} />
        </button>
      </div>
      <div className="tree-content">
        {categories.map(cat => renderCategory(cat))}
      </div>
    </div>
  )
}
