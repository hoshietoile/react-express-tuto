import React from 'react'
import './App.scss'
// dependencies
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// components
import Index from './components/pages/Index/Index'
import Migration from './components/pages/Migration/Migration'
import Seed from './components/pages/Seed/Seed'
import Sql from './components/pages/Sql/Sql'
import GenericTemplate from './components/templates/GenericTemplate/GenericTemplate'

const App: React.FC = () => {
  return (
    <Router>
      <GenericTemplate>
        <Switch>
          <Route path="/" component={ Index } exact />
          <Route path="/migration" component={ Migration } exact />
          <Route path="/seed" component={ Seed } exact />
          <Route path="/sql" component={ Sql } exact />
        </Switch>
      </GenericTemplate>
    </Router>
  )
}

export default App
