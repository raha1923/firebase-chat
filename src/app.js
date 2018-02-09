import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './app.css';

import Login            from './component/login/login';
import PrivateChat      from './component/private-chat/private-chat';

class App extends Component {

  getChildContext() {
    return {color: "purple"};
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/chat/:id" component={PrivateChat}/>
        </div>
      </Router>
    );
  }
}

App.childContextTypes = {
  color: PropTypes.string,
}

export default App;
