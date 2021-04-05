import React, { useMemo } from 'react'
import formatClass from '../../../assets/js/modules/formatClass'
import './InputBox.scss'

export type inputBoxProps = {
  label?: string
  value: string | number
  appendClass?: string
  disabled?: boolean
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InputBox: React.FC<inputBoxProps> = ({
  label,
  value,
  handleInput,
  disabled = false,
  appendClass
}) => {
  const inputBoxClass = useMemo(() => {
    return formatClass(
      'input',
      appendClass ? appendClass : ''
    )
  }, [appendClass])
  const inputClass = useMemo(() => {
    return disabled ? 'disable' : ''
  }, [disabled])
  return (
    <div className={ inputBoxClass }>
      <label>
        <span>{ label }</span>
        <input
          className={ inputClass }
          value={ value }
          disabled={ disabled }
          onInput={ (event: React.ChangeEvent<HTMLInputElement>) => handleInput(event)}
        />
      </label>
    </div>
  )
}
export default InputBox