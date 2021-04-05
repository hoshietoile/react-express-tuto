import React, { createContext, useState, useReducer, useEffect } from 'react'
import './Migration.scss'
// atoms
import BaseCard from './../../atoms/BaseCard/BaseCard'
// molecules
import BlockBtn from './../../molecules/BlockBtn/BlockBtn'
import InputBox from './../../molecules/InputBox/InputBox'
// organisms
import MigrationModal from './../../organisms/MigrationModal/MigrationModal'
import MigrationTable from './../../organisms/MigrationTable/MigrationTable'
import MigrationTab from './../../organisms/MigrationTab/MigrationTab'
// dependencies
import AceEditor from "react-ace"
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/mode-sql'
// consts
import { consts } from './../../../config/consts'

export type selectOptionType = {
  key: number
  value: number
  text: string
}
export type editorProps = {
  fileType: string
  contents: string
  readOnly: boolean
  onChange?: (content: string) => void
  theme?: string
}
export type itemType = {
  id: number | null
  value: string
  primary_key: boolean
  column_name: string
  concrete_name: string
  data_type: string
  num1: number | string
  num2: number | string
  constraints: number[]
}
const defaultItem: itemType = {
  id: null,
  value: '',
  primary_key: false,
  column_name: '',
  concrete_name: '',
  data_type: '',
  num1: '',
  num2: '',
  constraints: []
}

// https://qiita.com/makishy/items/bb014073d6e494b1b35f
export enum ActionType {
  primary_key = 'primary_key',
  column_name = 'column_name',
  concrete_name = 'concrete_name',
  data_type = 'data_type',
  num1 = 'num1',
  num2 = 'num2',
  constraints = 'constraints',
  all = 'all'
}
export type ColumnAction = {
  type: ActionType
  payload: itemType
}
const reducer: React.Reducer<itemType, ColumnAction> = (
  state: itemType,
  action: ColumnAction
) => {
  switch (action.type) {
    case ActionType.primary_key:
      return {
        ...state,
        primary_key: action.payload.primary_key
      }
    case ActionType.column_name:
      return {
        ...state,
        column_name: action.payload.column_name
      }
    case ActionType.concrete_name:
      return {
        ...state,
        concrete_name: action.payload.concrete_name
      }
    case ActionType.data_type:
      return {
        ...state,
        data_type: action.payload.data_type
      }
    case ActionType.num1:
      return {
        ...state,
        num1: action.payload.num1
      }
    case ActionType.num2:
      return {
        ...state,
        num2: action.payload.num2
      }
    case ActionType.constraints:
      return {
        ...state,
        constraints: action.payload.constraints
      }
    case ActionType.all:
      return {
        ...state,
        ...action.payload
      }
    default:
      throw new Error()
  }
}
// https://qiita.com/_akira19/items/8911567227ce38a1bdf6
type columnFormContextType = {
  columnFormState: itemType
  columnFormDispatch: React.Dispatch<ColumnAction>
}
export const ColumnFormContext = createContext({} as columnFormContextType)

type targetColumnType = {
  index: null | number
}

const targetColumnState: targetColumnType = {
  index: null
}

const initColumnItems: itemType[] = []
const dataTypeOptions: selectOptionType[] = consts.DATA_TYPES
const constraintsOptions: selectOptionType[] = consts.CONSTRAINTS

const Migration: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isSetPrimaryKey, setIsSetPrimaryKey] = useState(false)
  const [tableName, setTableName] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [targetColumn, setTargetColumn] = useState(targetColumnState)
  const [columnItems, setColumnItems] = useState(initColumnItems)
  const [columnFormState, columnFormDispatch] = useReducer(reducer, defaultItem)
  
  /**
   * プライマリキーの変更を監視
   */
  useEffect(() => {
    const columns = columnItems.slice()
    const primaryColumn = columns.filter((col: itemType) => col.primary_key)
    let primaryKeyFlag = false
    if (primaryColumn.length > 0) {
      primaryKeyFlag = true
    }
    setIsSetPrimaryKey(primaryKeyFlag)
  }, [columnFormState])
  /**
   * タブクリック時ハンドラ
   */
  const handleTabClick = (index: number):void => {
    setTabIndex(index)
  }
  const handleAdderClick = ():void => {
    setTargetColumn({ index: null })
    initForm()
    setIsModalShow(true)
  }
  /**
   * 編集ボタンクリック時ハンドラ
   */
  const handleEditClick = (item: itemType, index: number):void => {
    setTargetColumn({ index })
    initForm()
    columnFormDispatch({ type: ActionType.all, payload: item})
    setIsModalShow(true)
  }
  /**
   * 削除ボタンクリック時ハンドラ
   */
  const handleDeleteClick = (item: itemType, index: number):void => {
    const currentItems = columnItems.slice()
    currentItems.splice(index, 1)
    setColumnItems([...currentItems])
  }
  /**
   * フォームのstate初期化
   */
  const initForm = () => {
    const initItem: itemType = {
      id: null,
      value: '',
      primary_key: false,
      column_name: '',
      concrete_name: '',
      data_type: '',
      num1: '',
      num2: '',
      constraints: []
    }
    columnFormDispatch({ type: ActionType.all, payload: { ...initItem }})
  }
  /**
   * フォーム保存時ハンドラ
   */
  const handleModalSave = ():void => {
    const skelton = { ...defaultItem }
    const values = {
      ...columnFormState,
      num1: [5, 7, 8, 13].indexOf(parseInt(columnFormState.data_type)) === -1 ? '' : columnFormState.num1,
      num2: [7, 8].indexOf(parseInt(columnFormState.data_type)) === -1 ? '' : columnFormState.num2,
    }
    const newColumn = Object.assign(skelton, values)
    let newItems = []
    if (targetColumn.index === null) {
      newItems = [...columnItems, newColumn]
    } else {
      const updateTargetIndex = targetColumn.index
      newItems = columnItems.map((item, index) => {
        return index === updateTargetIndex ? newColumn : item
      })
    }
    setColumnItems(newItems)
    initModalShow()
  }
  /**
   * モーダル初期化
   */
  const initModalShow = ():void => {
    setTargetColumn({ index: null })
    setIsModalShow(false)
  }
  /**
   * プライマリキーセット時のハンドラ
   */
  const handlePrimaryKeySwitch = async (result: boolean) => {
    const updateResult = {
      type: ActionType.primary_key,
      payload: { ...columnFormState, primary_key: result }
    }
    // TODO: ここら辺の処理おそらくよくない気がする
    // 分岐内でhookを使わない
    if (isSetPrimaryKey && result) {
      const message = 'このカラムを主キーにしていいですか?'
      await promiseConfirm(message)
        .then(() => {
          const columns = columnItems.slice()
          const newColumns = columns.map((col: itemType) => {
              return { ...col, primary_key: false }
            })
          setColumnItems(newColumns)
          columnFormDispatch(updateResult)
        })
    } else {
      columnFormDispatch(updateResult)
    }
  }
  /**
   * promiseを返すconfirm
   */
  const promiseConfirm = (message: string) => {
    return new Promise((resolve, reject) => {
      if (window.confirm(message)) {
        resolve(true)
      } else {
        reject(false)
      }
    })
  }
  
  const handleTableCancelClick = () => {
    console.log(columnItems)
  }
  const handleTableSaveClick = () => {
    console.log(columnItems)
    // ※テスト用
    setEditorContent(JSON.stringify(columnItems, null, 2))
  }
  /**
   * エディターの入力ハンドラー
   */
  const editorHandler = (content: string) => {
    setEditorContent(content)
  }
  
  const handleTableNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setTableName(event.target.value)

  return (
    <ColumnFormContext.Provider value={{ columnFormState, columnFormDispatch }}>
      <div className="migration">
        <BaseCard>
          {/* タブ */}
          <MigrationTab
            tabTexts={ ['ColumnDefinitions', 'CommitMigration'] }
            activeTab={ tabIndex }
            handleTabClick={ handleTabClick }
          >
            {/* タブ1 */}
            <div key="ColumnDefinitions" className="column-definitions">
              <div className="column-definitions__header">
                <div className="column-definitions__header-title">
                  <InputBox
                    label="TableName"
                    value={ tableName }
                    handleInput={ handleTableNameInput }
                  />
                </div>
                <button
                  className="column-definitions__adder"
                  onClick={ handleAdderClick }
                >
                  <span>✚</span>
                </button>
              </div>
              <div className="column-definitions__body">
                <MigrationTable
                  items={ columnItems }
                  handleEditClick={ handleEditClick }
                  handleDeleteClick={ handleDeleteClick }
                />
              </div>
            </div>
            {/* タブ2 */}
            <div key="CommitMigration" className="commit-migration">
              {/* https://petitviolet.hatenablog.com/entry/20191230/1577712145 */}
              <AceEditor
                mode="sql"
                theme="xcode"
                width="700"
                value={ editorContent }
                enableBasicAutocompletion={true}
                onChange={ editorHandler }
              />
              {/* ボタングループ */}
              <div className="commit-migration__footer">
                <BlockBtn
                  type="secondary"
                  handleClick={ handleTableCancelClick }
                >Cancel
                </BlockBtn>
                <BlockBtn handleClick={ handleTableSaveClick }>
                  Save
                </BlockBtn>
              </div>
            </div>
          </MigrationTab>
          {/* </div> */}
        </BaseCard>
        {/* モーダル */}
        { isModalShow ?
          <MigrationModal
            isShown={ isModalShow }
            initForm={ initForm }
            initModalShow={ initModalShow }
            handlePrimaryKeySwitch={ handlePrimaryKeySwitch }
            handleModalSave={ handleModalSave }
            dataTypeOptions={ dataTypeOptions }
            constraintsOptions={ constraintsOptions }
          />
          : null
        }
      </div>
    </ColumnFormContext.Provider>
  )
}
export default Migration