import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown, Checkbox} from "semantic-ui-react";
import AddScene from "./AddScene";
import ViewScene from "./ViewScene";
import EditScene from "./EditScene";

export default class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scenes   : [],
            curScene : '',
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
                                <Table.HeaderCell>Serial Number</Table.HeaderCell>
                                <Table.HeaderCell>Scene Name</Table.HeaderCell>
                                <Table.HeaderCell>Condition</Table.HeaderCell>
                                <Table.HeaderCell>Device</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.scenes.map(scene =>
                                <Table.Row>
                                    <Table.Cell collapsing>{scene.serialNumber}</Table.Cell>
                                    <Table.Cell>{scene.sceneName}</Table.Cell>
                                    <Table.Cell>{scene.cond}</Table.Cell>
                                    <Table.Cell>{scene.device}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button.Group>
                                            <Button positive onClick={() => this.handleViewScene(scene) }>View</Button>
                                            <Button.Or/>
                                            <Button onClick={() => {} }>Edit</Button>
                                        </Button.Group>
                                    </Table.Cell>
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
            case 'view':
                return (
                    <ViewScene
                        scene={curScene}
                        onSuccess={this.handleSuccess}
                        onEdit={() => this.handleEditScene()}/>
                );
            case 'edit':
                return (
                    <EditScene
                        scene={curScene}
                        onSuccess={this.handleSuccess}
                        onCancel={() => this.handleViewScene()}
                        onDelete={this.handleDelete}/>
                );
            default:
                return undefined;
        }
    }

    handleFilter = () => {
        const {type} = this.state;
        this.fetchScenes(type === 'none' ? undefined : type);
    };

    handleAddScene = () => {
        this.setState({
            action: 'add'
        })
    };

    handleViewScene = (scene) => {
        if (scene) {
            this.setState({
                action   : 'view',
                curScene : scene
            })
        } else {
            this.setState({
                action: 'view',
            })
        }
    };

    handleEditScene = (scene) => {
        if (scene) {
            this.setState({
                action   : 'edit',
                curScene: scene
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

    handleSuccess = () => {
        this.handleCancel();
        this.handleFilter();
        this.fetchConds();
    };
}
