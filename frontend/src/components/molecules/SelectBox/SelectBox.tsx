import React, { useMemo, useState } from 'react'
import formatClass from '../../../assets/js/modules/formatClass'
import './SelectBox.scss'

export type selectOptionType = {
  key: number
  value: number
  text: string
}

export type selectBoxProps = {
  isOpen: boolean
  label?: string
  inputText: string
  options: selectOptionType[]
  handleSelectClick: () => void
  optionCb: (selectedValue: string) => void
  multiple?: boolean
  appendClass?: string
}

const SelectBox: React.FC<selectBoxProps> = ({
  isOpen,
  label,
  inputText,
  options,
  handleSelectClick,
  optionCb,
  multiple = false,
  appendClass
}) => {

  const [labelActive, setLabelActive] = useState(0)

  /**
   * セレクトボックスのクラス
   */
  const selectBoxClass = useMemo(() => {
    return formatClass(
      "input select",
      appendClass ? appendClass : "",
      () => isOpen ? "active" : ""
    )
  }, [appendClass, isOpen])

  /**
   * セレクトオプションマッピング
   */
  const selectOptions = useMemo(() => {
    return options.map((op, index) => (
      <li
        key={ index }
        className={
          formatClass(
            'selectbox__option',
            op.value === 0 ? 'label' : 'default',
            () => labelActive === op.key ? 'active' : ''
          )
        }
        onClick={ () => handleSelect(op) }
      >{ op.text }</li>
    ))
  }, [labelActive])

  /**
   * オプションクリック時ハンドラ
   */
  const handleSelect = (selected: selectOptionType) => {
    const value = selected.value.toString()
    const labelKey = multiple ? selected.key : 0
    setLabelActive(labelKey)
    optionCb(value)
  }

  return (
    <div className={ selectBoxClass }>
      <label onClick={ handleSelectClick }>
        <span>{ label }</span>
        <input value={ inputText } readOnly />
      </label>
      { isOpen ? 
        <div className="selectbox card">
          <ul>
            { selectOptions }
          </ul>
        </div>
        : null
      }
    </div>
  )
}

export default SelectBox