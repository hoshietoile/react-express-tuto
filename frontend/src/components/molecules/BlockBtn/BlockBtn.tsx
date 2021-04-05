import React, { useMemo } from 'react'
import './BlockBtn.scss'
// modules
import formatClass from '../../../assets/js/modules/formatClass'
// atoms
import BaseBtn from './../../atoms/BaseBtn/BaseBtn'

export type blockBtnProps = {
  children: React.ReactNode
  appendClass?: string
  type?: string
  handleClick?: () => void
}

const BlockBtn: React.FC<blockBtnProps> = ({
  children,
  appendClass,
  handleClick,
  type = 'primary'
}) => {
  const blockBtnClass = useMemo(() => {
    return formatClass(
      'btn--block',
      appendClass ? appendClass : '',
      () => ['primary', 'secondary'].indexOf(type) !== -1 ? type : ''
    )
  }, [appendClass, type])
  return (
    <BaseBtn
      appendClass={ blockBtnClass }
      handleClick={ handleClick }
    >
      { children }
    </BaseBtn>
  )
}
export default BlockBtn