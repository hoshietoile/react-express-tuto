import React, { useMemo } from 'react'
// modules
import formatClass from '../../../assets/js/modules/formatClass'
// atoms
import './BaseCard.scss'

export type baseCardProps = {
  children: React.ReactNode
  appendClass?: string
  flat?: boolean
}

const BaseCard: React.FC<baseCardProps> = ({ children, appendClass, flat}) => {
  const baseCardClass = useMemo(() => {
    return formatClass(
      'card',
      appendClass ? appendClass: '',
      () => flat ? 'flat' : ''
    )
  }, [appendClass, flat])
  return (
    <div className={ baseCardClass }>
      { children }
    </div>
  )
}
export default BaseCard