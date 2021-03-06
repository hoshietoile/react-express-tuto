import React, { useMemo } from 'react'
import './TheSidebar.scss'
// icons
import IndexIcon from './../../../assets/images/browser.svg'
import MigrationIcon from './../../../assets/images/database.svg'
import SeederIcon from './../../../assets/images/cards.svg'
import SqlIcon from './../../../assets/images/text.svg'
// molecules
import LinkPanel from './../../molecules/LinkPanel/LinkPanel'
// modules
import formatClass from './../../../assets/js/modules/formatClass'

export type TheSidebarProps = {
  isDrawerOpen: boolean
}

const TheSidebar: React.FC<TheSidebarProps> = ({ isDrawerOpen }) => {
  
  const drawerClass = useMemo(():string => {
    return formatClass('sidebar', '', () => {
      return isDrawerOpen ? 'opened' : 'closed'
    })
  }, [isDrawerOpen])

  return (
    <div className={ drawerClass }>
      <LinkPanel 
        linkTo="/"
        linkText="Index"
        iconSrc={ IndexIcon }
        iconSize="md"
        iconAlt="index"
      />
      <LinkPanel 
        linkTo="/migration"
        linkText="Migration"
        iconSrc={ MigrationIcon }
        iconSize="md"
        iconAlt="migration"
      />
      <LinkPanel 
        linkTo="/seed"
        linkText="Seeder"
        iconSrc={ SeederIcon }
        iconSize="md"
        iconAlt="seeder"
      />
      <LinkPanel 
        linkTo="/sql"
        linkText="Sql"
        iconSrc={ SqlIcon }
        iconSize="md"
        iconAlt="sql"
      />
    </div>
  )
}
export default TheSidebar