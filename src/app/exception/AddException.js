import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class addException extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serialNumber     : '',
      exceptionCode    : '',
      exceptionContent : '',
      disabled         : false,
      serialNumberError: null,
      exceptionCodeError  : null,
      exceptionContentError:null,
      message          : null,
    }
  }

  get message() {
    switch (this.state.message) {
      case 'success':
        return (
          <Message
            success
            header='Success'
            content="You've successfully added a device. Exception list will be refreshed in 3 seconds."
          />
        );
      case 'error':
        return (
          <Message
            error
            header='Fail to add device'
            content='Please check your exception info and try again later.'
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <Segment>
        <Header as='h1'>Add Exception</Header>
        {this.message}
        <Form>
          <Form.Field required>
            <label>Serial Number</label>
            <Form.Input
              placeholder='Serial Number'
              name='serialNumber'
              value={this.state.serialNumber}
              onChange={this.handleChange}
              error={this.state.serialNumberError}/>
          </Form.Field>
          <Form.Field required>
            <label>Exception Code</label>
            <Form.Input
              placeholder='Exception Code'
              name='exceptionCode'
              value={this.state.exceptionCode}
              onChange={this.handleChange}
              error={this.state.exceptionCodeError}/>
          </Form.Field>
          <Form.Field required>
            <label>Exception Content</label>
            <Form.Input
              placeholder='Exception Content'
              name='exceptionContent'
              value={this.state.exceptionContent}
              onChange={this.handleChange}
              error={this.state.exceptionContentError}/>
          </Form.Field>
          <Button.Group>
            <Button onClick={this.handleSubmit} positive>Submit</Button>
            <Button.Or/>
            <Button onClick={this.props.onCancel}>Cancel</Button>
          </Button.Group>
        </Form>
      </Segment>
    );
  }

  handleChange = (e, {name, value}) => {
    if (name === 'disabled') {
      this.setState({disabled: !this.state.disabled})
    } else {
      this.setState({[name]: value})
    }
  };

  handleSubmit = () => {
    const {serialNumber, exceptionCode,exceptionContent} = this.state;
    let hasError                                     = false;
    if (!serialNumber) {
      hasError = true;
      this.setState({serialNumberError: 'Please Input Serial Number'})
    } else {
      this.setState({serialNumberError: null})
    }
    if (!exceptionCode) {
      hasError = true;
      this.setState({exceptionCodeError: 'Please Input ExceptionCode '})
    } else {
      this.setState({exceptionCodeError: null})
    }
    if (!exceptionContent) {
      hasError = true;
      this.setState({exceptionContentError: 'Please Input ExceptionContent '})
    } else {
      this.setState({exceptionContentError: null})
    }
    if (!hasError) {
      let time = new Date().toDateString()
      let isresolved = false
      const exception        = {
        serialNumber, exceptionCode,exceptionContent,time,isresolved
      };
      const handleSuccess = this.props.onSuccess;
      console.log(exception);
      request.post('/addException', exception)
        .then(res => {
          const code = res.code;
          if (code !== 200) {
            console.log(res.message);
            this.setState({message: 'error'});
          } else {
            this.setState({message: 'success'});
            setTimeout(() => {
              this.setState({message: null});
              handleSuccess();
            }, 3000);
          }
        });
    }
  }
}
