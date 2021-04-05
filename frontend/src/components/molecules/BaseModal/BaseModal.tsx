import React, { useMemo } from 'react'
import './BaseModal.scss'

// modules
import formatClass from './../../../assets/js/modules/formatClass'
// molecules
import CloseBtn from './../../molecules/CloseBtn/CloseBtn'
// atoms
import BaseCard from './../../atoms/BaseCard/BaseCard'
import BaseOverlay from './../../atoms/BaseOverlay/BaseOverlay'

export type baseModalProps = {
  children: React.ReactNode
  isShown: boolean
  headerTemplate?: () => React.ReactNode
  footerTemplate?: () => React.ReactNode
  handleModalCloseClick: () => void
}

const BaseModal: React.FC<baseModalProps> = ({
  children,
  isShown,
  headerTemplate,
  footerTemplate,
  handleModalCloseClick
}) => {
  /**
   * headerがある場合
   */
  const useHeader = () => {
    if (headerTemplate) {
      return (
        <div className="modal__header">
          { headerTemplate() }
        </div>
      )
    } else {
      return null
    }
  }
  /**
   * footerがある場合
   */
  const useFooter = () => {
    if (footerTemplate) {
      return (
        <div className="modal__footer reverse">
          { footerTemplate() }
        </div>
      )
    } else {
      return null
    }
  }
  /**
   * モーダルクラス
   */
  const modalClass = useMemo(() => {
    return formatClass("modal", "", () => {
      return isShown ? "active" : "disable"
    })
  }, [isShown])
  
  return (
    <BaseOverlay isShown={ isShown }>
      <BaseCard appendClass={ modalClass }>
        <CloseBtn
          appendClass="modal__close"
          handleClick={ handleModalCloseClick }
        />
        { useHeader() }
        <div className="modal__body">
          { children }
        </div>
        { useFooter() }
      </BaseCard>
    </BaseOverlay>
  )
}
export default BaseModal