import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import { UserService } from '../../service/';
import './login.css';

class Login extends Component {

  userService = null;

  state = {
    mobileNumber: '',
    verificationCode: '',
    smsDelivered: false,
    smsInProgress: false,
    verified: false,
    verificateCodeInProgress: false
  }

  confirmationResult = null;

  componentDidMount() {
    this.userService = new UserService();
  }

  sendSms = () => {
    let { mobileNumber, smsInProgress } = this.state;
    if (smsInProgress) return;
    this.setState({smsInProgress: true});
    this.userService.login('mobile', {phoneNumber: mobileNumber}).then(() => {
      this.setState({smsDelivered: true, smsInProgress: false});
    });
  };

  verifyCode = () => {
    let { verificationCode, verificateCodeInProgress } = this.state;
    if (verificateCodeInProgress) return;
    this.setState({verificateCodeInProgress: true});
    this.userService.verifyCode(verificationCode).then(() => {
      this.setState({smsDelivered: false, verificateCodeInProgress: true});
      this.context.router.history.push('/chat/41gay9As9xNue7vR3KYgVijMWKg2')
    });
  };

  render() {
    let { mobileNumber, smsDelivered, verified, smsInProgress, verificateCodeInProgress } = this.state;
    return (
      <Grid container className="login">
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
            <Paper shadow2="true" className="form-box">
              <Grid container justify="center" spacing={16}>
                <Grid item xs={12}>
                  <Paper className="user-logo-container">
                    <Icon className="user-logo" color="disabled">
                      account_circle
                    </Icon>
                  </Paper>
                </Grid>
                <div hidden={smsDelivered || verified}>
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <TextField
                        label="Mobile Number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="+989300000000"
                        helperText="Mobile"
                        fullWidth
                        margin="normal"
                        value={mobileNumber}
                        onChange={e => this.setState({mobileNumber: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={9} md={6}>
                      <Button
                        id="submit-user"
                        onClick={() => this.sendSms()}
                        fullWidth
                        variant="raised"
                        disabled={smsInProgress}
                        color="primary"
                      >
                        {smsInProgress ? 'Sending SMS ...' : 'Send SMS'}
                      </Button>
                    </Grid>
                  </Grid>
                </div>
                <div hidden={!smsDelivered || verified}>
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <TextField
                        label="Verification Code"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="------"
                        helperText="Code"
                        fullWidth
                        margin="normal"
                        onChange={e => this.setState({verificationCode: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={9} md={6}>
                      <Button
                        onClick={() => this.verifyCode()}
                        fullWidth
                        variant="raised"
                        disabled={verificateCodeInProgress}
                        color="primary"
                      >
                        {verificateCodeInProgress ? 'In Verifing ...' : 'Verify'}
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Login;
