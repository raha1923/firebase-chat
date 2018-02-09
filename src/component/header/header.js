import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import './header.css';

class Header extends Component {

  render() {
    return (
      <AppBar position="fixed">
        <Toolbar>
          <IconButton onClick={this.props.drawerToggle} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className="title">
            Title
          </Typography>
          <Button onClick={() => this.context.router.history.push('/login')} color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  drawerToggle: PropTypes.func.isRequired
};

Header.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Header;
