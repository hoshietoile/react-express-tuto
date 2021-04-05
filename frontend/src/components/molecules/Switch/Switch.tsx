import React, { useMemo } from 'react'
import './Switch.scss'

export type switchProps = {
  value: boolean
  handleSwitch: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Switch: React.FC<switchProps> = ({ value, handleSwitch }) => {
  const switchClass = useMemo(() => {
    return value ? 'active' : ''
  }, [value])
  return (
    <div className="switch">
      <span>Primary Key</span>
      <label className={ switchClass }>
        <input
          type="checkbox"
          defaultChecked={ value }
          onInput={ (event: React.ChangeEvent<HTMLInputElement>) => handleSwitch(event) }
        />
      </label>
    </div>
  )
}
export default Switch