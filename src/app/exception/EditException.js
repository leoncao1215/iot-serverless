import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class EditException extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.exception;
    this.state = {
      exceptionId:data.exceptionId,
      serialNumber  : data.serialNumber,
      exceptionContent: data.exceptionContent,
      exceptionCode : data.exceptionCode,
      time : data.time,
      isresolved : data.isresolved||false,
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
            content="You've successfully added an exception. Exception list will be refreshed in 3 seconds."
          />
        );
      case 'error':
        return (
          <Message
            error
            header='Fail to add exception'
            content='Please check your exception info and try again later.'
          />
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.exception !== this.props.exception) {
      this.setState({
        exceptionId     :this.props.exception.exceptionId,
        serialNumber     : this.props.exception.serialNumber,
        exceptionCode       : this.props.exception.exceptionCode,
        exceptionContent             : this.props.exception.exceptionContent,
        isresolved         : this.props.exception.isresolved,
      })
    }
  }

  render() {
    return (
      <Segment>
        <Header as='h1'>Edit Exception</Header>
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
          <Form.Field required>
          <Form.Checkbox
              toggle
              label='IsResolved'
              name='isresolved'
              checked={this.state.isresolved}
              onChange={(e, {name, value}) => {
                this.setState({isresolved:!this.state.isresolved})
            }}/>
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
    
      this.setState({[name]: value})
  };

  handleSubmit = () => {
    const {serialNumber, exceptionCode,exceptionContent,isresolved,exceptionId,time} = this.state;
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
      const exception        = {
         serialNumber, exceptionCode,exceptionContent,time,isresolved, exceptionId
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
