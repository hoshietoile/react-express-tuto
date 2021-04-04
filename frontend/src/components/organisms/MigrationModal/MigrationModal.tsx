import React, { useContext, useMemo, useState } from 'react'
import './MigrationModal.scss'
// modules
import formatClass from './../../../assets/js/modules/formatClass'
// contexts
import {
  ColumnFormContext,
  ActionType,
  selectOptionType
} from './../../pages/Migration/Migration'


export type migrationModalProps = {
  isShown: boolean
  dataTypeOptions: selectOptionType[]
  constraintsOptions: selectOptionType[]
  initForm: () => void
  handleModalSave: () => void
  initModalShow: () => void
  handlePrimaryKeySwitch: (result: boolean) => Promise<void>
}

const MigrationModal: React.FC<migrationModalProps> = ({
  isShown,
  dataTypeOptions,
  constraintsOptions,
  initForm,
  handleModalSave,
  initModalShow,
  handlePrimaryKeySwitch
}) => {
  const [isDataTypeCardShow, setisDataTypeCardShow] = useState(false)
  const [isConstraintsCardShow, setIsConstraintsCardShow] = useState(false)
  const [dataTypeLabelActive, setDataTypeLabelActive] = useState(0)
  const { columnFormState, columnFormDispatch } = useContext(ColumnFormContext)

  /**
   * モーダル初期化
   */
  const initModal = ():void => {
    setisDataTypeCardShow(false)
    setIsConstraintsCardShow(false)
    initModalShow()
  }
  /**
   * モーダルクローズ時ハンドラ
   */
  const handleModalCloseClick = ():void => {
    initForm()
    initModal()
  }
  /**
   * 保存ボタン押下時ハンドラ
   */
  const handleSaveClick = ():void => {
    handleModalSave()
    initModal()
  }
  /**
   * プライマリキースイッチクラス
   */
  const switchClass = useMemo(() => {
    return columnFormState.primary_key ? 'active' : ''
  }, [columnFormState.primary_key])
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
    if (!columnFormState) return ''
    return formatClass("input", "", () => {
      return [5, 7, 8, 13].indexOf(parseInt(columnFormState.data_type)) === -1 ? "disable" : ""
    })
  }, [columnFormState])
  /**
   * データ型 値2クラス
   */
  const num2InputClass = useMemo(() => {
    if (!columnFormState) return ''
    return formatClass("input", "", () => {
      return [7, 8].indexOf(parseInt(columnFormState.data_type)) === -1 ? "disable" : ""
    })
  }, [columnFormState])
  /**
   * モーダルクラス
   */
  const modalClass = useMemo(() => {
    return formatClass("modal card", "", () => {
      return isShown ? "active" : "disable"
    })
  }, [isShown])
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
    if (!columnFormState) return ''
    const selected = columnFormState.data_type
    const selectTarget = dataTypeOptions.slice()
    const target = selectTarget.find((st) => st.value === parseInt(selected))
    return target ? target.text : ''
  }, [columnFormState])
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
    if (!columnFormState) return ''
    const selected = columnFormState.constraints
    const selectTexts = constraintsOptions
      .slice()
      .filter((st: selectOptionType) => selected.find(v => v === st.value))
      .map((st) => st.text)
    return selectTexts.join(', ')
  }, [columnFormState])
  /**
   * プライマリキースイッチハンドラ
   */
  const handlePrimaryKey = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    handlePrimaryKeySwitch(event.target.checked)
  }
  return (
    <div className={ modalClass }>
      <button
        className="modal__close btn"
        onClick={ handleModalCloseClick }
      >✖</button>
      <div className="modal__header">
        { columnFormState.column_name }
      </div>
      <div className="modal__body">
        {/* プライマリキー */}
        <div className="switch">
          <span>Primary Key</span>
          <label className={ switchClass }>
            <input
              type="checkbox"
              defaultChecked={ columnFormState.primary_key }
              onInput={ (event: React.ChangeEvent<HTMLInputElement>) => handlePrimaryKey(event) }
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
                value={ columnFormState.num1 }
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
                value={ columnFormState.num2 }
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
  )
}

export default MigrationModal