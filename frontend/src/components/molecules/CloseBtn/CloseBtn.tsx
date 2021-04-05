import React, { useMemo } from 'react'
import './CloseBtn.scss'
// modules
import formatClass from './../../../assets/js/modules/formatClass'
// atoms
import BaseBtn from './../../atoms/BaseBtn/BaseBtn'

export type closeBtnProps = {
  appendClass: string
  handleClick: () => void
}

const CloseBtn: React.FC<closeBtnProps> = ({ appendClass, handleClick }) => {
  const closeBtnClass = useMemo(() => {
    return formatClass('close-btn', appendClass ? appendClass : '')
  }, [appendClass])
  return (
    <BaseBtn
      appendClass={ closeBtnClass }
      handleClick={ handleClick }
    >✖</BaseBtn>
  )
}
export default CloseBtn