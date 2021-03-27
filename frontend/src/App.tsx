import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.scss'

import Index from './components/pages/Index/Index'
import Migration from './components/pages/Migration/Migration'
import Seed from './components/pages/Seed/Seed'
import Sql from './components/pages/Sql/Sql'

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={ Index } exact />
        <Route path="/migration" component={ Migration } exact />
        <Route path="/seed" component={ Seed } exact />
        <Route path="/sql" component={ Sql } exact />
      </Switch>
    </Router>
  )
}

export default App
