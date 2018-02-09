import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
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
        <Grid item xs={12} className={item.sender === this.targetId ? 'flex-row' : 'flex-row-reverse'} key={messages.indexOf(item)}>
          <span className={item.sender === this.targetId ? 'recived' : 'sended'}>{item.message}</span>
        </Grid>
      );
    }
    return (
      <Grid container className="private-chat">
        <Grid item xs={12}>
          <Grid id="chat-box" container justify="center" spacing={16}>
            {renderedMessage}
            <Element name="end-of-chat"></Element>
          </Grid>
        </Grid>
        <Grid item xs={12} id="message-input">
          <Grid container justify="center" spacing={0}>
            <Grid item xs={10}>
              <TextField
                label="Message"
                labelClassName="white-color"
                helperTextClassName="white-color"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="message ..."
                helperText="Message"
                fullWidth
                autoFocus={true}
                margin="normal"
                value={message}
                onChange={e => this.setState({message: e.target.value})}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={this.submitMessage}
                fullWidth
                variant="raised"
                color="primary"
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

}

export default PrivateChat;
