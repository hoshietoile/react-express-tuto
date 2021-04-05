import React, { useState } from 'react'
// dependencies
import AceEditor from "react-ace"
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/mode-sql'

export type aceProps = {
  fileType: string
  contents: string
  readOnly: boolean
  onChange?: (content: string) => void
  theme?: string
}

const Ace: React.FC<aceProps> = ({ 
  fileType,
  contents,
  readOnly,
  theme,
  onChange
}) => {
  const [editorContent, setEditorContent] = useState('')
  
  /**
   * エディターの入力ハンドラー
   */
  const editorHandler = (content: string) => {
    setEditorContent(content)
  }

  return (
    <AceEditor
      mode="sql"
      theme="xcode"
      width="700"
      value={ editorContent }
      enableBasicAutocompletion={true}
      onChange={ editorHandler }
    />
  )
}
export default Ace