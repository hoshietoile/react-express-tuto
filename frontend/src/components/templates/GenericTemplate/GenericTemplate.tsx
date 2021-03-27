import React, { useState } from 'react'
import './GenericTemplate.scss'

export type GenericTemplateProps = {
  children: React.ReactNode
}

const GenericTemplate: React.FC<GenericTemplateProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="generic-template">
      <header className="header">
        header
      </header>
      <div className="container">
        <div className="drawer">
          drawer
        </div>
        <main className="main">
          { children }
        </main>
      </div>
    </div>
  )
}
export default GenericTemplate