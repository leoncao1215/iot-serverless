import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown, Checkbox} from "semantic-ui-react";
import AddScene from "./AddScene";

export default class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devices  : [],
            types    : [],

            scenes   : [],
            conds    : [],
            action   : '',
            curScene: {},
        }
    }

    componentDidMount() {
        this.fetchScenes();
        this.fetchConds();
    }

    render() {
        return (
            <div>
                {this.sceneTable}
                {this.actionPane}
            </div>
        )
    };

    fetchScenes = (type) => {
        if (!type) {
            request.get('/querySceneList')
                .then(res =>
                    this.setState({
                        scenes: res.scenes
                    })
                );
        }
    };

    fetchConds = () => {
        request.get('/queryCondList')
            .then(res =>
                this.setState({
                    types: res.types
                })
            );
    };

    get sceneTable() {
        const options = [
            {key: 'none', value: 'none', text: '-- none --'},
        ];

        // this.state.types.forEach(type => options.push({key: type, value: type, text: type}));

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
                <div className="scene-list">
                    <Header as='h1' floated='left'>Scenes List</Header>
                    <Button basic color='green' floated='right' onClick={this.handleAddScene}>Add Scene</Button>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Serial Number</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Device Name</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Control</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {/*{this.state.devices.map(device =>*/}
                            {/*    <Table.Row>*/}
                            {/*        <Table.Cell collapsing>{device.serialNumber}</Table.Cell>*/}
                            {/*        <Table.Cell collapsing>{device.type}</Table.Cell>*/}
                            {/*        <Table.Cell>{device.deviceName}</Table.Cell>*/}
                            {/*        <Table.Cell collapsing>{getDeviceStatus(device)}</Table.Cell>*/}
                            {/*        <Table.Cell collapsing>*/}
                            {/*            <Button*/}
                            {/*                basic*/}
                            {/*                disabled={device.down}*/}
                            {/*                positive={!device.down && device.switcher === 'on'}*/}
                            {/*                negative={!device.down && device.switcher === 'off'}*/}
                            {/*                onClick={() => this.handleControlDevice(device.serialNumber, device.switcher === 'on' ? 'turnOff' : 'turnOn')}*/}
                            {/*            >*/}
                            {/*                Turn {device.switcher === 'on' ? 'off' : 'on'}*/}
                            {/*            </Button>*/}
                            {/*        </Table.Cell>*/}
                            {/*        <Table.Cell collapsing>*/}
                            {/*            <Button.Group>*/}
                            {/*                <Button positive onClick={() => this.handleViewDevice(device)}>View</Button>*/}
                            {/*                <Button.Or/>*/}
                            {/*                <Button onClick={() => this.handleEditDevice(device)}>Edit</Button>*/}
                            {/*            </Button.Group>*/}
                            {/*        </Table.Cell>*/}
                            {/*    </Table.Row>*/}
                            {/*)}*/}
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='6'>
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
        const {curScene} = this.state;
        switch (this.state.action) {
            case 'add':
                return (
                    <AddScene
                        onSuccess={this.handleSuccess}
                        onCancel={this.handleCancel}/>
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
        this.fetchScenes(type === 'none' ? undefined : type);
    };

    handleAddScene = () => {
        this.setState({
            action: 'add'
        })
    };

    handleViewDevice = (device) => {
        if (device) {
            this.setState({
                action   : 'view',
                curScene: device
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
                curScene: device
            })
        } else {
            this.setState({
                action: 'edit',
            })
        }
    };

    handleControlDevice = (serialNumber, action) => {
        request.put(`/controlDevice?targetDevice=${serialNumber}&action=${action}`, {})
            .then(res => {
                this.handleFilter();
            })
    };

    handleCancel = () => {
        this.setState({
            action: ''
        })
    };

    handleSuccess = () => {
        this.handleCancel();
        this.handleFilter();
        this.fetchConds();
    };
}
