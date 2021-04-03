import React, { useRef, useState, useCallback, useMemo, useReducer, useEffect } from 'react'
import './Migration.scss'
// modules
import formatClass from './../../../assets/js/modules/formatClass'
// icons
import KeyIcon from './../../../assets/images/key.svg'
import EditIcon from './../../../assets/images/checksheet.svg'
import DeleteIcon from './../../../assets/images/dustbox.svg'
// atoms
import Icon from './../../atoms/Icon/Icon'
// dependencies
import AceEditor from "react-ace"
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/mode-sql'

type itemType = {
  id: number | null
  value: string
  primary_key: boolean
  column_name: string
  concrete_name: string
  data_type: string
  num1: number | null
  num2: number | null
  constraints: number[]
}
type headerType = {
  order: number
  value: string
  text: string
}
type selectOptionType = {
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
    num1: null,
    num2: null,
    constraints: [1, 2]
  },
  {
    id: 2,
    value: 'user_name',
    primary_key: false,
    column_name: 'user_name',
    concrete_name: 'ユーザー名',
    data_type: '2',
    num1: null,
    num2: null,
    constraints: [1]
  },
  {
    id: 3,
    value: 'email',
    primary_key: false,
    column_name: 'email',
    concrete_name: 'Email',
    data_type: '2',
    num1: null,
    num2: null,
    constraints: []
  },
]

const dataTypeOptions: selectOptionType[] = [
  { key: 0, value: 0, text: '整数型' },
  { key: 0,  value: 1, text: 'TINYINT' },
  { key: 0,  value: 2, text: 'SMALLINT' },
  { key: 0,  value: 3, text: 'INT' },
  { key: 0,  value: 4, text: 'BITINT' },
  { key: 1,  value: 0, text: '浮動小数点型' },
  { key: 1,  value: 5, text: 'FLOAT' },
  { key: 1,  value: 6, text: 'DOUBLE' },
  { key: 2,  value: 0, text: '固定小数点型' },
  { key: 2,  value: 7, text: 'DECIMAL' },
  { key: 2,  value: 8, text: 'NUMERIC' },
  { key: 3,  value: 0, text: '日付' },
  { key: 3,  value: 9, text: 'DATE' },
  { key: 3,  value: 10, text: 'TIME' },
  { key: 3,  value: 11, text: 'DATETIME' },
  { key: 3,  value: 12, text: 'TIMESTAMP' },
  { key: 4,  value: 0, text: '文字列' },
  { key: 4,  value: 13, text: 'VARCHAR' },
  { key: 4,  value: 14, text: 'TEXT' }
]

const constraintsOptions: selectOptionType[] = [
  { key: 0, value: 1, text: 'NOT NULL' },
  { key: 0, value: 2, text: 'UNIQUE' }
]

const defaultItem: itemType = {
  id: null,
  value: '',
  primary_key: false,
  column_name: '',
  concrete_name: '',
  data_type: '',
  num1: null,
  num2: null,
  constraints: []
}
const reduceItem = Object.assign({}, defaultItem)

enum ActionType {
  primary_key = 'primary_key',
  column_name = 'column_name',
  concrete_name = 'concrete_name',
  data_type = 'data_type',
  num1 = 'num1',
  num2 = 'num2',
  constraints = 'constraints',
  all = 'all'
}

type ColumnAction = {
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

type targetColumnType = {
  index: null | number
}

const targetColumnState: targetColumnType = {
  index: null
}

const Migration: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(1)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isDataTypeCardShow, setisDataTypeCardShow] = useState(false)
  const [isConstraintsCardShow, setIsConstraintsCardShow] = useState(false)
  const [tableName, setTableName] = useState('')
  const [targetColumn, setTargetColumn] = useState(targetColumnState)
  const [isSetPrimaryKey, setIsSetPrimaryKey] = useState(false)
  const [dataTypeLabelActive, setDataTypeLabelActive] = useState(0)
  const [columnItems, setColumnItems] = useState(itemOptions)
  const [columnFormState, columnFormDispatch] = useReducer(reducer, reduceItem)
  const [editorContent, setEditorContent] = useState('')
  /**
   * プライマリキーの変更を監視
   */
  useEffect(() => {
    const columns = columnItems.slice()
    const primaryColumn = columns.filter((col) => col.primary_key)
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
   * フォーム保存時ハンドラ
   */
  const handleSaveClick = ():void => {
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
   * モーダルクローズ時ハンドラ
   */
  const handleModalCloseClick = ():void => {
    initForm()
    initModalShow()
  }
  /**
   * モーダル初期化
   */
  const initModalShow = ():void => {
    setTargetColumn({ index: null })
    setisDataTypeCardShow(false)
    setIsConstraintsCardShow(false)
    setIsModalShow(false)
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
      num1: null,
      num2: null,
      constraints: []
    }
    columnFormDispatch({ type: ActionType.all, payload: { ...initItem }})
  }
  /**
   * プライマリキーセット時のハンドラ
   */
  const handlePrimaryKeySwitch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.checked
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
          const newColumns = columns.map((col) => {
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
   * プライマリキースイッチクラス
   */
  const switchClass = useMemo(() => {
    return columnFormState.primary_key ? 'active' : ''
  }, [columnFormState.primary_key])
  /**
   * モーダルクラス
   */
  const modalClass = useMemo(() => {
    return formatClass("modal card", "", () => {
      return isModalShow ? "active" : "disable"
    })
  }, [isModalShow])
  /**
   * オーバーレイセレクトクラス
   */
  const overlayClass = useMemo(() => {
    return formatClass("overlay", "", () => {
      return isModalShow ? "active" : "disable"
    })
  }, [isModalShow])
  /**
   * タブヘッダクラス
   */
  const tabHeaderClass = useCallback((index: number) => {
    return formatClass("tab__header--label", '', () => {
      return index === tabIndex ? 'active' : ''
    })
  }, [tabIndex])
  /**
   * データ型セレクトクラス
   */
  const dataTypeClass = useMemo(() => {
    return formatClass("input select input--datatype", "", () => {
      return isDataTypeCardShow ? "active" : ""
    })
  }, [isDataTypeCardShow])
  /**
   * 制約セレクトクラス
   */
  const constraintsClass = useMemo(() => {
    return formatClass("input select input--constraints", "", () => {
      return isConstraintsCardShow ? "active" : ""
    })
  }, [isConstraintsCardShow])
  /**
   * データ型 値1クラス
   */
  const num1InputClass = useMemo(() => {
    return formatClass("input", "", () => {
      return [5, 7, 8, 13].indexOf(parseInt(columnFormState.data_type)) === -1 ? "disable" : ""
    })
  }, [columnFormState.data_type])
  /**
   * データ型 値2クラス
   */
  const num2InputClass = useMemo(() => {
    return formatClass("input", "", () => {
      return [7, 8].indexOf(parseInt(columnFormState.data_type)) === -1 ? "disable" : ""
    })
  }, [columnFormState.data_type])
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
    const filteredItems = items.map((item, index) => (
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
  /**
   * データ型セレクトオプション
   */
  const dataTypeSelectOptions = useMemo(() => {
    return dataTypeOptions.map((dto, index) => (
      <li
        key={ index }
        className={
          formatClass(
            'selectbox__option',
            dto.value === 0 ? 'label' : 'default',
            () => dataTypeLabelActive === dto.key ? 'active' : ''
          )
        }
        onClick={ () => handleDataTypeOptionClick(dto) }
      >{ dto.text }</li>
    ))
  }, [dataTypeLabelActive])
  /**
   * データ型selectクリック時ハンドラ
   */
  const handleDataTypeOptionClick = (selected: selectOptionType) => {
    const value = selected.value.toString()
    const key = selected.key
    setDataTypeLabelActive(key)
    if (value !== '0') {
      const payload = { ...columnFormState, data_type: value }
      columnFormDispatch({ type: ActionType.data_type, payload })
    }
  }
  /**
   * データ型入力値
   */
  const dataTypeSelectedText = useMemo(() => {
    const selected = columnFormState.data_type
    const selectTarget = dataTypeOptions.slice()
    const target = selectTarget.find((st) => st.value === parseInt(selected))
    return target ? target.text : ''
  }, [columnFormState.data_type])
  /**
   * 制約セレクトオプション
   */
  const constraintsSelectOptions = useMemo(() => {
    return constraintsOptions.map((co, index) => (
      <li
        key={ index }
        className={
          formatClass(
            'selectbox__option active',
            co.value === 0 ? 'label' : 'default'
          )
        }
        onClick={ () => handleConstraintsOptionClick(co) }
      >{ co.text }</li>
    ))
  }, [])
  /**
   * 制約セレクトクリック時ハンドラ
   */
  const handleConstraintsOptionClick = (selected: selectOptionType):void => {
    const value = selected.value
    const prevConstraints = columnFormState.constraints
    const index = prevConstraints.indexOf(value)
    if (index !== -1) {
      prevConstraints.splice(index, 1)
    } else {
      prevConstraints.push(value)
    }
    const newValue = prevConstraints.slice()
    const payload = { ...columnFormState, constraints: newValue }
    columnFormDispatch({
      type: ActionType.constraints,
      payload
    })
  }
  /**
   * 制約入力値
   */
  const constraintsSelectedText = useMemo(() => {
    const selected = columnFormState.constraints
    const selectTexts = constraintsOptions
      .slice()
      .filter((st: selectOptionType) => selected.find(v => v === st.value))
      .map((st) => st.text)
    return selectTexts.join(', ')
  }, [columnFormState.constraints])

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
                    theme="github"
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
        <div className={ overlayClass }>
          <div className={ modalClass }>
            <button
              className="modal__close btn"
              onClick={ handleModalCloseClick }
            >✖</button>
            <div className="modal__header">
              header
            </div>
            <div className="modal__body">
              {/* プライマリキー */}
              <div className="switch">
                <span>Primary Key</span>
                <label className={ switchClass }>
                  <input
                    type="checkbox"
                    defaultChecked={ columnFormState.primary_key }
                    onInput={ (event: React.ChangeEvent<HTMLInputElement>) => handlePrimaryKeySwitch(event) }
                  />
                </label>
              </div>
              <div className="row">
                {/* データ型 */}
                <div className={ dataTypeClass }>
                  <label onClick={ () => setisDataTypeCardShow(!isDataTypeCardShow) }>
                    <span>DataType</span>
                    <input value={ dataTypeSelectedText } readOnly />
                  </label>
                  { isDataTypeCardShow ? 
                    <div className="selectbox card">
                      <ul>
                        { dataTypeSelectOptions }
                      </ul>
                    </div>
                    : null
                  }
                </div>
                {/* データ型桁数 */}
                <div className="input input--num">
                  <label>
                    <input
                      className={ num1InputClass }
                      value={ columnFormState.num1?.toString() }
                      disabled={ [5, 7, 8, 13].indexOf(parseInt(columnFormState.data_type)) === -1 }
                      onInput={ 
                        (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
                          type: ActionType.num1,
                          payload: { ...columnFormState, num1: parseInt(event.target.value) }
                        })
                      }
                    />
                  </label>
                </div>
                <div className="input input--num">
                  <label>
                    <input
                      className={ num2InputClass }
                      value={ columnFormState.num2?.toString() }
                      disabled={ [7, 8].indexOf(parseInt(columnFormState.data_type)) === -1 }
                      onInput={ 
                        (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
                          type: ActionType.num2,
                          payload: { ...columnFormState, num2: parseInt(event.target.value) }
                        })
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="row">
                {/* 制約 */}
                <div className={ constraintsClass }>
                  <label onClick={ () => setIsConstraintsCardShow(!isConstraintsCardShow) }>
                    <span>Constraints</span>
                    <input value={ constraintsSelectedText } readOnly />
                  </label>
                  { isConstraintsCardShow ? 
                    <div className="selectbox card">
                      <ul>
                        { constraintsSelectOptions }
                      </ul>
                    </div>
                    : null
                  }
                </div>
              </div>
              {/* カラム名 */}
              <div className="input">
                <label>
                  <span>ColumnName</span>
                  <input
                    value={ columnFormState.column_name }
                    onInput={ 
                      (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
                        type: ActionType.column_name,
                        payload: { ...columnFormState, column_name: event.target.value }
                      })
                    }
                  />
                </label>
              </div>
              {/* 物理名 */}
              <div className="input">
                <label>
                  <span>ConcreteName</span>
                  <input
                    value={ columnFormState.concrete_name }
                    onInput={ 
                      (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
                        type: ActionType.concrete_name,
                        payload: { ...columnFormState, concrete_name: event.target.value }
                      })
                    }
                  />
                </label>
              </div>
            </div>
            {/* ボタングループ */}
            <div className="modal__footer reverse">
              <button
                className="btn btn--block secondary"
                onClick={ handleModalCloseClick }
              >
                Close
              </button>
              <button
                className="btn btn--block primary"
                onClick={ handleSaveClick }
              >
                Save
              </button>
            </div>
          </div>
        </div>
        : null
      }
    </div>
  )
}
export default Migration