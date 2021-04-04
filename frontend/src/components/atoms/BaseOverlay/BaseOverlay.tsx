import React, { useMemo } from 'react'
import './BaseOverlay.scss'
import formatClass from './../../../assets/js/modules/formatClass'

export type baseOverLayProps = {
  children: React.ReactNode
  isShown: boolean
}

const BaseOverlay: React.FC<baseOverLayProps> = ({ children, isShown }) => {
    const overlayClass = useMemo(() => {
      return formatClass("overlay", "", () => {
        return isShown ? "active" : "disable"
      })
    }, [isShown])
  return (
    <div className={ overlayClass }>
      { children }
    </div>
  )
}

export default BaseOverlay