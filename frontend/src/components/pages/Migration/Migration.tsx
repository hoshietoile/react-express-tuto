import React, { createContext, useState, useCallback, useReducer, useEffect } from 'react'
import './Migration.scss'
// modules
import formatClass from './../../../assets/js/modules/formatClass'
// icons
import KeyIcon from './../../../assets/images/key.svg'
import EditIcon from './../../../assets/images/checksheet.svg'
import DeleteIcon from './../../../assets/images/dustbox.svg'
// atoms
import Icon from './../../atoms/Icon/Icon'
import BaseOverlay from './../../atoms/BaseOverlay/BaseOverlay'
// organisms
import MigrationModal from './../../organisms/MigrationModal/MigrationModal'
// dependencies
import AceEditor from "react-ace"
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/mode-sql'
// consts
import { consts } from './../../../config/consts'

type headerType = {
  order: number
  value: string
  text: string
}
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

const headerOptions: headerType[] = [
  {
    order: 0,
    value: 'primary_key',
    text: ''
  },
  {
    order: 1,
    value: 'column_name',
    text: 'ColumnName'
  },
  {
    order: 2,
    value: 'concrete_name',
    text: 'ConcreteName'
  },
  {
    order: 3,
    value: 'data_type',
    text: 'DataType'
  },
  {
    order: 4,
    value: 'constraints',
    text: 'Constraints'
  },
  {
    order: 5,
    value: 'edit_action',
    text: ''
  },
  {
    order: 6,
    value: 'delete_action',
    text: ''
  },
]

const itemOptions: itemType[] = [
  {
    id: 1,
    value: 'id',
    primary_key: false,
    column_name: 'id',
    concrete_name: 'ID',
    data_type: '1',
    num1: '',
    num2: '',
    constraints: [1, 2]
  },
  {
    id: 2,
    value: 'user_name',
    primary_key: false,
    column_name: 'user_name',
    concrete_name: 'ユーザー名',
    data_type: '2',
    num1: '',
    num2: '',
    constraints: [1]
  },
  {
    id: 3,
    value: 'email',
    primary_key: false,
    column_name: 'email',
    concrete_name: 'Email',
    data_type: '2',
    num1: '',
    num2: '',
    constraints: []
  },
]

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

// type columnFormProviderProps = {
//   children: React.ReactNode
// }
// const ColumnFormProvider: React.FC<columnFormProviderProps> = ({ children }) => {
//   const [columnFormState, columnFormDispatch]: [itemType, React.Dispatch<ColumnAction>]= useReducer(reducer, defaultItem)
//   return <ColumnFormContext.Provider value={{ columnFormState, columnFormDispatch }}>
//     { children }
//   </ColumnFormContext.Provider>
// }

type targetColumnType = {
  index: null | number
}

const targetColumnState: targetColumnType = {
  index: null
}

// const initColumnItems: itemType[] = []
const dataTypeOptions: selectOptionType[] = consts.DATA_TYPES
const constraintsOptions: selectOptionType[] = consts.CONSTRAINTS

const Migration: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(1)
  const [isModalShow, setIsModalShow] = useState(false)
  const [tableName, setTableName] = useState('')
  const [targetColumn, setTargetColumn] = useState(targetColumnState)
  const [isSetPrimaryKey, setIsSetPrimaryKey] = useState(false)
  const [columnItems, setColumnItems] = useState(itemOptions)
  const [columnFormState, columnFormDispatch] = useReducer(reducer, defaultItem)
  const [editorContent, setEditorContent] = useState('')
  
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
   * タブヘッダクラス
   */
  const tabHeaderClass = useCallback((index: number) => {
    return formatClass("tab__header--label", '', () => {
      return index === tabIndex ? 'active' : ''
    })
  }, [tabIndex])
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
      num1: [5, 7, 8, 13].indexOf(parseInt(columnFormState.data_type)) === -1 ? null : columnFormState.num1,
      num2: [7, 8].indexOf(parseInt(columnFormState.data_type)) === -1 ? null : columnFormState.num2,
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
  
  /**
   * テーブル行制約
   */
  const renderConstraints = (constraints: number[]) => {
    const render = constraintsOptions.filter((opt) => constraints.indexOf(opt.value) !== -1).map((opt) => opt.text)
    return render.join(', ')
  }
  /**
   * テーブル行データ型
   */
  const renderDataType = (dataType: string) => {
    const target = dataTypeOptions.find((op) => op.value === parseInt(dataType))
    return target ? target.text : ''
  }
  /**
   * テーブルレンダリング処理
   */
  const renderTable = () => {
    const headers = headerOptions.slice()
    const items = columnItems.slice()
    const headerLabels = headers
      .sort((a: headerType, b: headerType) => a.order - b.order)
      .map((header: headerType) => header.text)
    
    // TODO: TypeScriptで動的にキーを指定できるようにしたい
    // マッチングするvalueのみ取り出す
    // const headerLabelValues = headerLabels.map(header => header.text)
    // const filteredItems = items.map((item: itemType) => {
    //   headerLabelValues.reduce((accum: [], current: string) => {
    //     const key = keys[current]
    //     return [...accum, item[current]]
    //   }, [])
    //   return []
    // })

    // テーブル行マッピング
    const filteredItems = items.map((item: itemType, index) => (
      <>
        <td className="table__row--column">
          { item.primary_key ? <Icon src={ KeyIcon } size="sm" /> : null }
        </td>
        <td className="table__row--column">{ item['column_name'] }</td>
        <td className="table__row--column">{ item['concrete_name'] }</td>
        <td className="table__row--column">{ renderDataType(item['data_type']) }</td>
        <td className="table__row--column">{ renderConstraints(item['constraints']) }</td>
        <td className="table__row--column clickable"
          onClick={ () => handleEditClick(item, index) }
        >
          <Icon src={ EditIcon } size="sm" />
        </td>
        <td className="table__row--column clickable"
          onClick={ () => handleDeleteClick(item, index) }
        >
          <Icon src={ DeleteIcon } size="sm" />
        </td>
      </>
    ))
    // テーブルレンダリング
    return (
      <div className="table__wrapper">
        <table className="table">
          <thead className="table__header">
            <tr>
              { headerLabels.map((header, index) => (
                  <th key={ index } className="table__header--column">{ header }</th>
                ))
              }
            </tr>
          </thead>
          <tbody className="table__body">
            { filteredItems.map((item, index) => (
                <tr key={ index } className="table__row">{ item }</tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
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
  return (
    <ColumnFormContext.Provider value={{ columnFormState, columnFormDispatch }}>
      <div className="migration">
        <div className="card">
          <div className="tab">
            <div className="tab__header">
              <div
                className={ (() => tabHeaderClass(1))() }
                onClick={ () => handleTabClick(1) }
              >
                ColumnDefinitions
              </div>
              <div
                className={ (() => tabHeaderClass(2))() }
                onClick={ () => handleTabClick(2) }
              >
                CommitMigration
              </div>
            </div>
            {/* タブ */}
            <div className="tab__body">
              { tabIndex === 1 ?
                <div className="tab__content column">
                  <div className="column-definitions">
                    <div className="column-definitions__header">
                      <div className="column-definitions__header-title">
                        <div className="input">
                          <label>
                            <span>TableName</span>
                            <input
                              value={ tableName }
                              onChange={ 
                                (
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => setTableName(event.target.value)
                              } 
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        className="column-definitions__adder"
                        onClick={ handleAdderClick }
                      >
                        <span>✚</span>
                      </button>
                    </div>
                    <div className="column-definitions__body">
                      { (() => renderTable())() }
                    </div>
                  </div>
                </div>
                : null
              }
              { tabIndex === 2 ?
                <div className="tab__content">
                  <div className="commit-migration">
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
                      <button
                        className="btn btn--block secondary"
                        onClick={ handleTableCancelClick }
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn--block primary"
                        onClick={ handleTableSaveClick }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                : null
              }
            </div>
          </div>
        </div>
        {/* モーダル */}
        { isModalShow ?
          <BaseOverlay isShown={ isModalShow }>
            <MigrationModal
              isShown={ isModalShow }
              initForm={ initForm }
              initModalShow={ initModalShow }
              handlePrimaryKeySwitch={ handlePrimaryKeySwitch }
              handleModalSave={ handleModalSave }
              dataTypeOptions={ dataTypeOptions }
              constraintsOptions={ constraintsOptions }
            />
          </BaseOverlay>
          : null
        }
      </div>
    </ColumnFormContext.Provider>
  )
}
export default Migration