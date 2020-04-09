import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown, Checkbox} from "semantic-ui-react";
import AddUser from "./AddUser";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users   :   [],
            action  :    '',
            curUser :   {}
        }
    }

    componentDidMount() {
        this.fetchUsers();
    }

    render() {
        return (
            <div>
                {this.userTable}
                {this.actionPane}
            </div>
        )
    };

    fetchUsers = () => {
        request.get('/queryUserList')
            .then(res =>
                this.setState({
                    users: res.users
                })
            );
    };

    get userTable() {

        const getUserStatus = (user) => {
            if (user.disabled) {
                return 'Disabled';
            } else {
                return 'Enabled';
            }
        };

        const getUserAuthority = (user) => {
            if (user.authorized) {
                return 'Manager';
            } else {
                return 'User';
            }
        };

        return (
            <div>
                <div className="user-list">
                    <Header as='h1' floated='left'>Users List</Header>
                    <Button basic color='green' floated='right' onClick={this.handleAddUser}>Add User</Button>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>User Name</Table.HeaderCell>
                                <Table.HeaderCell>Password</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Authority</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.users.map(user =>
                                <Table.Row>
                                    <Table.Cell collapsing>{user.userName}</Table.Cell>
                                    <Table.Cell collapsing>{user.password}</Table.Cell>
                                    <Table.Cell collapsing>{getUserStatus(user)}</Table.Cell>
                                    <Table.Cell collapsing>{getUserAuthority(user)}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button.Group>
                                            <Button positive onClick={() => this.handleViewUser(user)}>View</Button>
                                            <Button.Or/>
                                            <Button onClick={() => this.handleEditUser(user)}>Edit</Button>
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
        const {curUser} = this.state;
        switch (this.state.action) {
            case 'add':
                return (
                    <AddUser
                        onSuccess={this.handleSuccess}
                        onCancel={this.handleCancel}/>
                );
            case 'view':
                return (
                    <ViewUser
                        user={curUser}
                        onSuccess={this.handleSuccess}
                        onEdit={() => this.handleEditUser()}
                        onDelete={this.handleDelete}/>
                );
            case 'edit':
                return (
                    <EditUser
                        user={curUser}
                        onSuccess={this.handleSuccess}
                        onCancel={() => this.handleViewUser()}
                        onDelete={this.handleDelete}/>
                );
            default:
                return undefined;
        }
    }

    handleAddUser = () => {
        this.setState({
            action: 'add'
        })
    };

    handleViewUser = (user) => {
        if (user) {
            this.setState({
                action   : 'view',
                curUser: user
            })
        } else {
            this.setState({
                action: 'view',
            })
        }
    };

    handleEditUser = (user) => {
        if (user) {
            this.setState({
                action   : 'edit',
                curUser: user
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
        this.fetchUsers();
    };

    handleDelete = (user) => {
        const {userId} = this.state.curUser;
        request.delete(`/deleteUser?userId=${userId}`)
            .then(res => {
                this.handleSuccess();
            })
    };
}
