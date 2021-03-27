import React, { useMemo } from 'react'
import './BasePanel.scss'
// modules
import formatClass from './../../../assets/js/modules/formatClass'

export type BasePanelProps = {
  children: React.ReactNode
  appendClass?: string
}

const BasePanel: React.FC<BasePanelProps> = ({ children, appendClass }) => {
  
  const panelClass = useMemo(() => {
    return formatClass('panel', appendClass)
  }, [appendClass])

  return (
    <div className={ panelClass }>
      { children }
    </div>
  )
}
export default BasePanel