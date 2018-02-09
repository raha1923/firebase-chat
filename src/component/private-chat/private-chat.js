import React, { Component } from 'react';
import { Grid, Row, Col, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { Element, scroller } from 'react-scroll'

import { PrivateChatService } from '../../service/';
import './private-chat.css';

class PrivateChat extends Component {

  privateChatService = null;
  targetId = null;

  state = {
    message: '',
    messages: []
  }

  componentWillMount() {
    this.targetId = this.props.match.params.id;
    this.privateChatService = new PrivateChatService(this.targetId);
    this.privateChatService.listenToMessage().subscribe(data => {
      let messages = this.state.messages;
      messages.push({
        message: data.message
      });
      this.setState({messages});
      this.scrollToBottom();
    });
  }

  getConversationMessage = () => {
    this.privateChatService.getListOfMessages().subscribe(data => {
      console.log(data);
    });
  }

  submitMessage = () => {
    let { message } = this.state;
    this.privateChatService.sendMessage(message).then(() => {
      this.setState({message: ''});
    }, error => {
      console.log(error);
    });
  }

  scrollToBottom = () => {
    scroller.scrollTo('end-of-chat', {
      duration: 1000,
      delay: 100,
      smooth: true,
      containerId: 'chat-box',
      offset: 50
    })
  }

  render() {
    let { messages, message } = this.state;
    let renderedMessage = [];
    for(let item of messages) {
      renderedMessage.push(
        <Row className={item.sender === this.targetId ? 'flex-row' : 'flex-row-reverse'} key={messages.indexOf(item)}>
          <span className={item.sender === this.targetId ? 'recived' : 'sended'}>{item.message}</span>
        </Row>
      );
    }
    return (
      <Grid fluid={true} className="private-chat">
        <Row id="chat-box">
          <Col lg={12}>
            {renderedMessage}
            <Element name="end-of-chat"></Element>
          </Col>
        </Row>
        <Row id="message-input">
          <ButtonGroup className="col-12">
            <input
              className="form-control"
              type="text"
              placeholder="message ..."
              value={message}
              onKeyPress={e => e.key === 'Enter' && this.submitMessage()}
              onChange={e => this.setState({message: e.target.value})}
            />
            <Button onClick={this.submitMessage} bsStyle="primary">Send</Button>
          </ButtonGroup>
        </Row>
      </Grid>
    );
  }

}

export default PrivateChat;
