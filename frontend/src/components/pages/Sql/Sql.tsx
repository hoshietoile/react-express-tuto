import React, { useState } from 'react'
import './Sql.scss'

// atoms
import BaseCard from './../../atoms/BaseCard/BaseCard'
import BaseBtn from './../../atoms/BaseBtn/BaseBtn'
// molecules
import BlockBtn from './../../molecules/BlockBtn/BlockBtn'
// dependencies
import AceEditor from "react-ace"
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/mode-sql'


const Sql: React.FC = () => {
  const [editorContent, setEditorContent] = useState('')

  const editorHandler = (value: string) => {
    setEditorContent(value)
  }
  return (
    <BaseCard>
      <div className="sql__header">
        Sql Practice
      </div>
      <AceEditor
        mode="sql"
        theme="xcode"
        width="700"
        value={ editorContent }
        enableBasicAutocompletion={true}
        onChange={ editorHandler }
      />
      {/* ボタングループ */}
      <div className="sql__footer">
        <BlockBtn
          type="transparent"
        >
          Validate
        </BlockBtn>
        <BlockBtn
          type="secondary"
        >
          Clear
        </BlockBtn>
        <BlockBtn>
          Execute
        </BlockBtn>
      </div>
    </BaseCard>
  )
}
export default Sql