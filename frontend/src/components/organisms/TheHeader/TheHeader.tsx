import React, { useMemo } from 'react'
import './TheHeader.scss'
// icons
import ArrowIcon from './../../../assets/images/arrow.svg'

export type TheHeaderProps = {
  isDrawerOpen: boolean
  handleTogglerToggle: () => void
}

const TheHeader: React.FC<TheHeaderProps> = ({ isDrawerOpen, handleTogglerToggle }) => {

  const togglerClass= useMemo(():string => {
    const baseClass = "header__toggler"
    const isOpen = isDrawerOpen
    return `${baseClass} ${isOpen ? 'left' : 'right'}`.trim()
  }, [isDrawerOpen])

  return (
    <header className="header">
      <div 
        className={ togglerClass }
        onClick={ handleTogglerToggle }
      >
        <img src={ ArrowIcon } width="30" height="30" alt="" />
      </div>
      <div className="header__title">PractiSQL</div>
      <div className="header__search">
      </div>
    </header>
  )
}
export default TheHeader