import React, { useMemo } from 'react'
import './BaseBtn.scss'

import formatClass from './../../../assets/js/modules/formatClass'

export type baseBtnProps = {
  children: React.ReactNode
  appendClass?: string
  handleClick?: () => void
}

const BaseBtn: React.FC<baseBtnProps> = ({
  children,
  appendClass,
  handleClick
}) => {
  const baseBtnClass = useMemo(() => {
    return formatClass('btn', appendClass ? appendClass : '')
  }, [appendClass])
  return (
    <button
      className={ baseBtnClass }
      onClick={ handleClick }
    >
      { children }
    </button>
  )
}
export default BaseBtn