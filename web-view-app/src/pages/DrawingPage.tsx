import { Tldraw, Editor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback, useState } from 'react'

export const DrawingPage = () => {
  const [editor, setEditor] = useState<Editor | null>(null)
  
  const handleMount = useCallback((editor: Editor) => {
    console.log('Tldraw mounted', editor)
    setEditor(editor)
  }, [])

  const handleClearCanvas = useCallback(() => {
    if (editor) {
      const ids = editor.getCurrentPageShapeIds()
      editor.deleteShapes(ids)
    }
  }, [editor])

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Drawing Board</h1>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
            Local Mode
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleClearCanvas}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Clear Canvas
          </button>
          <button 
            onClick={() => editor?.undo()}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Undo
          </button>
          <button 
            onClick={() => editor?.redo()}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Redo
          </button>
        </div>
      </div>
      
      {/* Drawing Canvas */}
      <div className="flex-1 relative">
        <Tldraw 
          onMount={handleMount}
          className="absolute inset-0"
          autoFocus
        />
      </div>
      
      {/* Footer */}
      <div className="p-3 bg-white border-t text-center text-sm text-gray-500">
        Use the toolbar on the left to select different drawing tools
      </div>
    </div>
  )
}
