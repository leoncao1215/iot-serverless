import React from "react";
import {Button, Header, Segment} from "semantic-ui-react";
import './ViewDevice.scss';

export default class ViewDevice extends React.Component {
  constructor(props) {
    super(props);
    const {device} = this.props;
    this.state     = {
      serialNumber: device.serialNumber,
      deviceName  : device.deviceName,
      type        : device.type,
      disabled    : device.disabled,
    }
  }

  render() {
    const {serialNumber, deviceName, type, disabled, down} = this.props.device;
    return (
      <Segment clearing className='device-detail'>
        <Header as='h1'>Viewing Device: {serialNumber}</Header>
        <dl>
          <dt>Serial Number:</dt>
          <dd style={{marginLeft: '.5em'}}>{serialNumber}</dd>
        </dl>
        <dl>
          <dt>Device Name:</dt>
          <dd style={{marginLeft: '.5em'}}>{deviceName}</dd>
        </dl>
        <dl>
          <dt>Device Type:</dt>
          <dd>{type}</dd>
        </dl>
        <dl>
          <dt>Disabled:</dt>
          <dd>{disabled.toString()}</dd>
        </dl>
        <dl style={{marginBottom: '1.5em'}}>
          <dt>Down:</dt>
          <dd>{down.toString()}</dd>
        </dl>
        <Button onClick={this.props.onEdit}>Edit</Button>
        <Button floated='right' onClick={this.handleDelete} negative>Delete</Button>
      </Segment>
    );
  }

  handleDelete = () => this.props.onDelete(this.props.device);
}
