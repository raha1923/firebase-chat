import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

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
    console.log(this.context);
    if (this.context.router) {
      this.context.router.transitionTo('/');
    }
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
      this.context.router.transitionTo('/');
    });
  };

  render() {
    let { mobileNumber, smsDelivered, verified, smsInProgress, verificateCodeInProgress } = this.state;
    return (
      <Grid fluid={true} className="login">
        <Row className="justify-content-center align-items-center">
          <Col xs={12} sm={10} md={4} lg={4} className="form-box">
            <Row className="box-header">
              <span>Login</span>
            </Row>
            <Row className="input-box">
              <Col lg={12} hidden={smsDelivered || verified}>
                <input
                  type='text'
                  placeholder='Mobile Number'
                  className="form-control"
                  value={mobileNumber}
                  onKeyPress={e => e.key === 'Enter' && this.sendSms()}
                  onChange={e => this.setState({mobileNumber: e.target.value})}
                />
                <button
                  className="btn btn-block btn-info"
                  id='submit-user'
                  disabled={smsInProgress}
                  onClick={() => this.sendSms()}>
                  {smsInProgress ? 'In Sending sms ...' : 'Send sms'}
                </button>
              </Col>
              <Col lg={12} hidden={!smsDelivered}>
                <input
                  type='text'
                  placeholder='Verification Code'
                  className="form-control"
                  onKeyPress={e => e.key === 'Enter' && this.verifyCode()}
                  onChange={e => this.setState({verificationCode: e.target.value})}
                />
                <button
                  className="btn btn-block btn-info"
                  id='submit-user'
                  disabled={verificateCodeInProgress}
                  onClick={() => this.verifyCode()}>
                  {verificateCodeInProgress ? 'In Verifing Code ...' : 'Verify Code'}
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Login.contextTypes = {
  color: PropTypes.string,
  router: PropTypes.object.isRequired
};

export default Login;
