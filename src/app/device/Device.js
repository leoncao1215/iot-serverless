import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment} from "semantic-ui-react";

export default class Device extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    }
  }

  componentDidMount() {
    request.get('/queryDeviceList')
      .then(res =>
        this.setState({
          devices: res.devices
        })
      );
  }

  getDeviceStatus = (device) => {
    if (device.disabled) {
      return 'Disabled';
    } else if (device.down) {
      return 'Offline';
    } else {
      return 'Normal';
    }
  };

  get deviceRows() {
    return this.state.devices.map(device =>
      <Table.Row>
        <Table.Cell>{device.serialNumber}</Table.Cell>
        <Table.Cell>{device.deviceName}</Table.Cell>
        <Table.Cell>{this.getDeviceStatus(device)}</Table.Cell>
        <Table.Cell collapsing>
          <Button.Group>
            <Button positive>View</Button>
            <Button.Or />
            <Button>Edit</Button>
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    )
  }

  render() {
    return (
      <div className="device-list">
        {/*<Segment clearing>*/}
          <Header as='h1' floated='left'>Devices List</Header>
          <Button basic floated='right' color='green'>Add Device</Button>
        {/*</Segment>*/}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Serial Number</Table.HeaderCell>
              <Table.HeaderCell>Device Name</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.deviceRows}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron left' />
                  </Menu.Item>
                  <Menu.Item as='a'>1</Menu.Item>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron right' />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  };
}
