import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown, Checkbox} from "semantic-ui-react";
import AddScene from "./AddScene";
import ViewScene from "./ViewScene";
import EditScene from "./EditScene";
import ViewDevice from "../device/ViewDevice";

export default class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            condType  : '',
            condTypes : [],
            scenes    : [],
            curScene  : '',
        }
    }

    componentDidMount() {
        this.fetchScenes();
        this.fetchCondTypes();
    }

    render() {
        return (
            <div>
                {this.sceneTable}
                {this.actionPane}
            </div>
        )
    };

    fetchScenes = (condType) => {
        if (!condType) {
            request.get('/querySceneList')
                .then(res => {
                    if (res.scenes) {
                        this.setState({
                            scenes: res.scenes
                        })
                    }
                });
        } else {
            request.get(`/querySceneListByType?condType=${condType}`)
                .then(res => {
                    if (res.scenes) {
                        this.setState({
                            scenes: res.scenes
                        })
                    }
                });
        }
    };

    fetchCondTypes = () => {
        request.get('/queryCondTypeList')
            .then(res => {
                if (res.condTypes) {
                    this.setState({
                        condTypes: res.condTypes
                    })
                }
            });
    }

    get sceneTable() {
        let options = this.state.condTypes.map(type => {return {key: type, value: type, text: type}});
        options.unshift({key: 'none', value: 'none', text: '-- none --'})

        return (
            <div>
                <div className="scene-list">
                    <Header as='h1' floated='left'>Scenes List</Header>
                    <Dropdown search selection onChange={this.handleChangeType}
                              placeholder='Filter condition type' options={options}/>
                    <Button basic onClick={this.handleFilter} style={{marginLeft: '.5em'}}>Filter</Button>
                    <Button basic color='green' floated='right' onClick={this.handleAddScene}>Add Scene</Button>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Serial Number</Table.HeaderCell>
                                <Table.HeaderCell>Scene Name</Table.HeaderCell>
                                <Table.HeaderCell>Condition Type</Table.HeaderCell>
                                <Table.HeaderCell>Condition</Table.HeaderCell>
                                <Table.HeaderCell>Device</Table.HeaderCell>
                                <Table.HeaderCell>State</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.scenes.map(scene =>
                                <Table.Row>
                                    <Table.Cell collapsing>{scene.serialNumber}</Table.Cell>
                                    <Table.Cell collapsing>{scene.sceneName}</Table.Cell>
                                    <Table.Cell collapsing>{scene.condType}</Table.Cell>
                                    <Table.Cell>{scene.condDesc}</Table.Cell>
                                    <Table.Cell>{scene.device}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button
                                            basic
                                            positive={scene.isUsing}
                                            negative={!scene.isUsing}
                                            onClick={() => {this.handleChangeSceneState(scene.serialNumber, !scene.isUsing)}}
                                        >
                                            {scene.isUsing ? '使用中' : '未使用'}
                                        </Button>
                                    </Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button.Group>
                                            <Button positive onClick={() => this.handleViewScene(scene) }>View</Button>
                                            <Button.Or/>
                                            <Button onClick={() => this.handleEditScene(scene) } >Edit</Button>
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
                        onEdit={() => this.handleEditScene()}
                        onDelete={this.handleDelete}/>
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

    handleChangeType = (e, data) => {
        this.setState({
            condType: data.value
        })
    };

    handleFilter = () => {
        const {condType} = this.state;
        this.fetchScenes(condType === 'none' ? undefined : condType);
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

    handleChangeSceneState = (serialNumber, isUsing) => {
        const scene = {
            'serialNumber': serialNumber,
            'isUsing': isUsing
        }
        console.log(scene);
        request.post('/updateSceneUsing', scene)
            .then(res => {
                const code = res.code;
                if (code !== 200) {
                    console.log(res.message);
                    this.setState({message: 'error'});
                } else {
                    this.setState({message: 'success'});
                    this.handleFilter();
                }
            });
    }

    handleCancel = () => {
        this.setState({
            action: ''
        })
    };

    handleSuccess = () => {
        this.handleCancel();
        this.handleFilter();
    };

    handleDelete = () => {
        const {serialNumber} = this.state.curScene;
        request.delete(`/deleteScene?serialNumber=${serialNumber}`)
            .then(res => {
                this.handleSuccess();
            })
    };
}
