import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown} from "semantic-ui-react";

export default class Device extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices  : [],
      types    : [],
      action   : '',
      curDevice: {}
    }
  }

  componentDidMount() {
    this.fetchDevices();
    this.fetchTypes();
  }

  render() {
    return (
      <div>
        {this.deviceTable}
        {this.actionPane}
      </div>
    )
  };

  fetchDevices = (type) => {
    if (!type) {
      request.get('/queryDeviceList')
        .then(res =>
          this.setState({
            devices: res.devices
          })
        );
    } else {
      request.get(`/queryDeviceListByType?type=${type}`)
        .then(res =>
          this.setState({
            devices: res.devices
          })
        )
    }
  };

  fetchTypes = () => {
    request.get('/queryDeviceTypeList')
      .then(res =>
        this.setState({
          types: res.types
        })
      );
  };

  get deviceTable() {
    const options = [
      {key: 'none', value: 'none', text: '-- none --'},
    ];

    this.state.types.forEach(type => options.push({key: type, value: type, text: type}));

    const getDeviceStatus = (device) => {
      if (device.disabled) {
        return 'Disabled';
      } else if (device.down) {
        return 'Offline';
      } else {
        return 'Normal';
      }
    };

    return (
      <div>
        <div className="device-list">
          <Header as='h1' floated='left'>Devices List</Header>
          <Button basic floated='right' color='green' onClick={this.handleAddDevice}>Add Device</Button>
          <Dropdown search selection onChange={this.handleChangeType}
                    placeholder='Filter device type' options={options}/>
          <Button basic onClick={this.handleFilter} style={{marginLeft: '.5em'}}>Filter</Button>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Serial Number</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Device Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.state.devices.map(device =>
                <Table.Row>
                  <Table.Cell collapsing>{device.serialNumber}</Table.Cell>
                  <Table.Cell collapsing>{device.type}</Table.Cell>
                  <Table.Cell>{device.deviceName}</Table.Cell>
                  <Table.Cell collapsing>{getDeviceStatus(device)}</Table.Cell>
                  <Table.Cell collapsing>
                    <Button.Group>
                      <Button positive onClick={() => this.handleViewDevice(device)}>View</Button>
                      <Button.Or/>
                      <Button onClick={() => this.handleEditDevice(device)}>Edit</Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='5'>
                  <Menu floated='right' pagination>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron left'/>
                    </Menu.Item>
                    <Menu.Item as='a'>1</Menu.Item>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron right'/>
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
      </div>
    )
  }

  get actionPane() {
    const {curDevice} = this.state;
    switch (this.state.action) {
      case 'add':
        return (
          <Segment>
            <Header as='h1'>Add Pane</Header>
            <Button onClick={this.handleCancel}>Cancel</Button>
          </Segment>
        );
      case 'view':
        return (
          <Segment>
            <Header as='h1'>Device: {`${curDevice.deviceName} (${curDevice.serialNumber})`}</Header>
            <Button onClick={() => this.handleEditDevice()}>Edit</Button>
          </Segment>
        );
      case 'edit':
        return (
          <Segment>
            <Header as='h1'>Editing Device: {`${curDevice.deviceName} (${curDevice.serialNumber})`}</Header>
            <Button onClick={() => this.handleViewDevice()}>Cancel</Button>
          </Segment>
        );
      default:
        return undefined;
    }
  }

  handleChangeType = (e, data) => {
    this.setState({
      type: data.value
    })
  };

  handleFilter = () => {
    const {type} = this.state;
    this.fetchDevices(type === 'none' ? undefined : type);
  };

  handleAddDevice = () => {
    this.setState({
      action: 'add'
    })
  };

  handleViewDevice = (device) => {
    if (device) {
      this.setState({
        action   : 'view',
        curDevice: device
      })
    } else {
      this.setState({
        action: 'view',
      })
    }
  };

  handleEditDevice = (device) => {
    if (device) {
      this.setState({
        action   : 'edit',
        curDevice: device
      })
    } else {
      this.setState({
        action: 'edit',
      })
    }
  };

  handleCancel = () => {
    this.setState({
      action: ''
    })
  };
}
