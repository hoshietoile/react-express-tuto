import React, { useContext, useMemo, useState } from 'react'
import './MigrationModal.scss'
// molecules
import BaseModal from './../../molecules/BaseModal/BaseModal'
import BlockBtn from './../../molecules/BlockBtn/BlockBtn'
import Switch from './../../molecules/Switch/Switch'
import SelectBox from './../../molecules/SelectBox/SelectBox'
import InputBox from './../../molecules/InputBox/InputBox'
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
  const [isDataTypeCardShow, setIsDataTypeCardShow] = useState(false)
  const [isConstraintsCardShow, setIsConstraintsCardShow] = useState(false)
  const { columnFormState, columnFormDispatch } = useContext(ColumnFormContext)

  /**
   * モーダル初期化
   */
  const initModal = ():void => {
    setIsDataTypeCardShow(false)
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
   * データ型セレクトクリック時ハンドラ
   */
  const handleDataTypeOptionClick = (value: string) => {
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
   * 制約セレクトクリック時ハンドラ
   */
  const handleConstraintsOptionClick = (rawValue: string):void => {
    const value = parseInt(rawValue)
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
  /**
   * headerTemplate
   */
  const headerTemplate = () => (
    <>{ columnFormState.column_name }</>
  )
  /**
   * footerTemplate
   */
  const footerTemplate = () => (
    <>
      <BlockBtn type="secondary" handleClick={ handleModalCloseClick }>
        Close
      </BlockBtn>
      <BlockBtn handleClick={ handleSaveClick }>
        Save
      </BlockBtn>
    </>
  )
  const handleNum1Input = (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
    type: ActionType.num1,
    payload: { ...columnFormState, num1: parseInt(event.target.value) }
  })
  const handleNum2Input = (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
    type: ActionType.num2,
    payload: { ...columnFormState, num2: parseInt(event.target.value) }
  })
  const handleColumnNameInput = (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
    type: ActionType.column_name,
    payload: { ...columnFormState, column_name: event.target.value }
  })
  const handleConcreteNameInput = (event: React.ChangeEvent<HTMLInputElement>) => columnFormDispatch({
    type: ActionType.concrete_name,
    payload: { ...columnFormState, concrete_name: event.target.value }
  })
  return (
    <BaseModal
      isShown={ isShown }
      headerTemplate={ headerTemplate }
      footerTemplate={ footerTemplate }
      handleModalCloseClick={ handleModalCloseClick }
    >
      {/* プライマリキー */}
      <Switch value={ columnFormState.primary_key} handleSwitch={ handlePrimaryKey } />
      <div className="row">
        {/* データ型 */}
        <SelectBox
          multiple
          label="DataType"
          isOpen={ isDataTypeCardShow }
          appendClass="input--datatype"
          inputText={ dataTypeSelectedText }
          options={ dataTypeOptions }
          optionCb={ handleDataTypeOptionClick }
          handleSelectClick={ () => setIsDataTypeCardShow(!isDataTypeCardShow) }
        />
        {/* データ型桁数 */}
        <InputBox
          value={ columnFormState.num1 }
          appendClass="input--num"
          disabled={ [5, 7, 8, 13].indexOf(parseInt(columnFormState.data_type)) === -1 }
          handleInput={ handleNum1Input }
        />
        <InputBox
          value={ columnFormState.num2 }
          appendClass="input--num"
          disabled={ [7, 8].indexOf(parseInt(columnFormState.data_type)) === -1 }
          handleInput={ handleNum2Input }
        />
      </div>
      <div className="row">
        {/* 制約 */}
        <SelectBox
          label="Constraints"
          isOpen={ isConstraintsCardShow }
          appendClass="input--constraints"
          inputText={ constraintsSelectedText }
          options={ constraintsOptions }
          optionCb={ handleConstraintsOptionClick }
          handleSelectClick={ () => setIsConstraintsCardShow(!isConstraintsCardShow) }
        />
      </div>
      {/* カラム名 */}
      <InputBox
        label="ColumnName"
        value={ columnFormState.column_name }
        handleInput={ handleColumnNameInput }
      />
      {/* 物理名 */}
      <InputBox
        label="ConcreteName"
        value={ columnFormState.concrete_name }
        handleInput={ handleConcreteNameInput }
      />
    </BaseModal>
  )
}

export default MigrationModal