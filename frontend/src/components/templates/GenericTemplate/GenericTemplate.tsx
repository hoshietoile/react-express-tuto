import React, { useState, useMemo } from 'react'
import './GenericTemplate.scss'
// dependencies
import { NavLink } from 'react-router-dom'
// icons
import ArrowIcon from './../../../assets/images/arrow.svg'
import IndexIcon from './../../../assets/images/browser.svg'
import MigrationIcon from './../../../assets/images/database.svg'
import SeederIcon from './../../../assets/images/cards.svg'
import SqlIcon from './../../../assets/images/text.svg'

export type GenericTemplateProps = {
  children: React.ReactNode
}

const GenericTemplate: React.FC<GenericTemplateProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = (payload: boolean):void => {
    setDrawerOpen(payload)
  }

  const drawerClass = useMemo(():string => {
    const baseClass = "drawer"
    const isOpen = drawerOpen
    return `${baseClass} ${isOpen ? 'opened' : 'closed'}`.trim()
  }, [drawerOpen])

  const togglerClass= useMemo(():string => {
    const baseClass = "header__toggler"
    const isOpen = drawerOpen
    return `${baseClass} ${isOpen ? 'left' : 'right'}`.trim()
  }, [drawerOpen])

  return (
    <div className="generic-template">
      <header className="header">
        <div 
          className={ togglerClass }
          onClick={ () => handleDrawerToggle(!drawerOpen) }
        >
          <img src={ ArrowIcon } width="30" height="30" alt="" />
        </div>
        <div className="header__title">title</div>
        <div className="header__search">
        </div>
      </header>
      <div className="container">
        <div className={ drawerClass }>
          <NavLink to="/" className="link">
            <div className="panel link-panel">
              <img src={ IndexIcon } width="36" height="36" alt="" />
              <span>index</span>
            </div>
          </NavLink>
          <NavLink to="/migration" className="link">
            <div className="panel link-panel">
              <img src={ MigrationIcon } width="36" height="36" alt="" />
              <span>Migration</span>
            </div>
          </NavLink>
          <NavLink to="/seed" className="link">
            <div className="panel link-panel">
              <img src={ SeederIcon } width="36" height="36" alt="" />
              <span>Seeder</span>
            </div>
          </NavLink>
          <NavLink to="/sql" className="link">
            <div className="panel link-panel">
              <img src={ SqlIcon } width="36" height="36" alt="" />
              <span>sql</span>
            </div>
          </NavLink>
        </div>
        <main className="main">
          <div className="page">
            { children }
          </div>
        </main>
      </div>
    </div>
  )
}
export default GenericTemplate
