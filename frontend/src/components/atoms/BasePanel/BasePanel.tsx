import React, { useMemo } from 'react'
import './BasePanel.scss'

export type BasePanelProps = {
  children: React.ReactNode
  appendClass?: string
}

const BasePanel: React.FC<BasePanelProps> = ({ children, appendClass }) => {
  const panelClass = useMemo(() => {
    const baseClass = "panel"
    return `${baseClass} ${appendClass ? appendClass : ''}`.trim()
  }, [appendClass])
  return (
    <div className={ panelClass }>
      { children }
    </div>
  )
}
export default BasePanel