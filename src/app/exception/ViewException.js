import React from "react";
import {Button, Header, Segment} from "semantic-ui-react";
import './ViewException.scss';

export default class ViewDevice extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.exception;
    this.state     = {
      serialNumber  : data.clientId,
      exceptionContent: data.content,
      exceptionCode : data.code,
      time : data.time,
      isresolved : data.isresolved||false
    }
  }

  render() {
    const {serialNumber, exceptionCode, exceptionContent, time, isresolved} = this.props.exception;
    return (
      <Segment clearing className='device-detail'>
        <Header as='h1'>Viewing Exception</Header>
        <dl>
          <dt>Serial Number:</dt>
          <dd style={{marginLeft: '.5em'}}>{serialNumber}</dd>
        </dl>
        <dl>
          <dt>Exception Code:</dt>
          <dd style={{marginLeft: '.5em'}}>{exceptionCode}</dd>
        </dl>
        <dl>
          <dt>Exception Content:</dt>
          <dd>{exceptionContent}</dd>
        </dl>
        <dl>
          <dt>Time:</dt>
          <dd>{time}</dd>
        </dl>
        <dl style={{marginBottom: '1.5em'}}>
          <dt>Isresolved:</dt>
          <dd>{isresolved?"Yes":"No"}</dd>
        </dl>
        <Button floated='right' onClick={this.props.onEdit}>Edit</Button>
        
      </Segment>
    );
  }

  handleDelete = () => this.props.onDelete(this.props.device);
}
