import React, { useMemo } from 'react'
import './TheHeader.scss'
// icons
import ArrowIcon from './../../../assets/images/arrow.svg'
// modules
import formatClass from './../../../assets/js/modules/formatClass'

export type TheHeaderProps = {
  isDrawerOpen: boolean
  handleTogglerToggle: () => void
}

const TheHeader: React.FC<TheHeaderProps> = ({ isDrawerOpen, handleTogglerToggle }) => {

  const togglerClass= useMemo(():string => {
    return formatClass('header__toggler', '', () => {
      return isDrawerOpen ? 'left' : 'right'
    })
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