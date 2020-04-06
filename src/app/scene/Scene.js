import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown, Checkbox} from "semantic-ui-react";
import AddScene from "./AddScene";

export default class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scenes   : [],
            curScene: {},
        }
    }

    componentDidMount() {
        this.fetchScenes();
    }

    render() {
        return (
            <div>
                {this.sceneTable}
                {this.actionPane}
            </div>
        )
    };

    fetchScenes = () => {
        request.get('/querySceneList')
            .then(res => {
                if (res.scenes) {
                    this.setState({
                        scenes: res.scenes
                    })
                }
            });
    };

    get sceneTable() {
        return (
            <div>
                <div className="scene-list">
                    <Header as='h1' floated='left'>Scenes List</Header>
                    <Button basic color='green' floated='right' onClick={this.handleAddScene}>Add Scene</Button>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Serial ID</Table.HeaderCell>
                                <Table.HeaderCell>Serial Number</Table.HeaderCell>
                                <Table.HeaderCell>Device Name</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.scenes.map(scene =>
                                <Table.Row>
                                    <Table.Cell>{scene.sceneId}</Table.Cell>
                                    <Table.Cell>{scene.sceneName}</Table.Cell>
                                    <Table.Cell collapsing>{scene.serialNumber}</Table.Cell>
                                </Table.Row>
                            )}
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
