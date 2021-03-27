import React, { useState } from 'react'
import './GenericTemplate.scss'
// organisms
import TheHeader from './../../organisms/TheHeader/TheHeader'
import TheSidebar from './../../organisms/TheSidebar/TheSidebar'

export type GenericTemplateProps = {
  children: React.ReactNode
}

const GenericTemplate: React.FC<GenericTemplateProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = ():void => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <div className="generic-template">
      <TheHeader isDrawerOpen={ drawerOpen } handleTogglerToggle={ handleDrawerToggle } />
      <div className="container">
        <TheSidebar isDrawerOpen={ drawerOpen } />
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
