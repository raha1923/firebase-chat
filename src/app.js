import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './app.css';

import Header           from './component/header/header';
import Login            from './component/login/login';
import PrivateChat      from './component/private-chat/private-chat';

class App extends Component {

  drawerToggle = () => {

  }

  render() {
    return (
      <Router>
        <div>
          <Header drawerToggle={this.drawerToggle} />
          <div className="app">
            <Route exact path="/login" component={Login}/>
            <Route exact path="/chat/:id" component={PrivateChat}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
