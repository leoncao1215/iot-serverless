import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown, Checkbox} from "semantic-ui-react";

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users  : [],
        }
    }

    componentDidMount() {
        // this.fetchUsers();
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
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                                <Table.Row>
                                    <Table.Cell collapsing>userName</Table.Cell>
                                    <Table.Cell collapsing>password</Table.Cell>
                                    <Table.Cell collapsing>
                                        status
                                    </Table.Cell>
                                    <Table.Cell collapsing>
                                        authorized
                                    </Table.Cell>
                                </Table.Row>
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

    handleAddUser = () => {

    };

    handleModifyUserStatus = (userId, action) => {

    };

    handleCancel = () => {
        this.setState({
            action: ''
        })
    };

    handleSuccess = () => {
        this.handleCancel();
    };

    handleDelete = (device) => {

    };
}
