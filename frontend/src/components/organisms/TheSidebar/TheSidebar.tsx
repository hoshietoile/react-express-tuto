import React, { useMemo } from 'react'
import './TheSidebar.scss'
// icons
import IndexIcon from './../../../assets/images/browser.svg'
import MigrationIcon from './../../../assets/images/database.svg'
import SeederIcon from './../../../assets/images/cards.svg'
import SqlIcon from './../../../assets/images/text.svg'
// molecules
import LinkPanel from './../../molecules/LinkPanel/LinkPanel'

export type TheSidebarProps = {
  isDrawerOpen: boolean
}

const TheSidebar: React.FC<TheSidebarProps> = ({ isDrawerOpen }) => {
  
  const drawerClass = useMemo(():string => {
    const baseClass = "sidebar"
    const isOpen = isDrawerOpen
    return `${baseClass} ${isOpen ? 'opened' : 'closed'}`.trim()
  }, [isDrawerOpen])

  return (
    <div className={ drawerClass }>
      <LinkPanel 
        linkTo="/"
        linkText="Index"
        iconSrc={ IndexIcon }
        iconSize="sm"
        iconAlt="index"
      />
      <LinkPanel 
        linkTo="/migration"
        linkText="Migration"
        iconSrc={ MigrationIcon }
        iconSize="sm"
        iconAlt="migration"
      />
      <LinkPanel 
        linkTo="/seed"
        linkText="Seeder"
        iconSrc={ SeederIcon }
        iconSize="sm"
        iconAlt="seeder"
      />
      <LinkPanel 
        linkTo="/sql"
        linkText="Sql"
        iconSrc={ SqlIcon }
        iconSize="sm"
        iconAlt="sql"
      />
    </div>
  )
}
export default TheSidebar