import React from "react";
import {Button, Header, Segment} from "semantic-ui-react";
import './ViewUser.scss';

export default class ViewUser extends React.Component {
    constructor(props) {
        super(props);
        const {user} = this.props;
        this.state = {
            userName     : user.userName,
            password       : user.password,
            disabled    :   user.disabled,
            authorized  :   user.authorized
        }
    }

    render() {
        const {userName, password, disabled, authorized} = this.props.user;
        return (
            <Segment clearing className='user-detail'>
                <Header as='h1'>Viewing User: {userName}</Header>
                <dl>
                    <dt>User Name:</dt>
                    <dd style={{marginLeft: '.5em'}}>{userName}</dd>
                </dl>
                <dl>
                    <dt>Password:</dt>
                    <dd style={{marginLeft: '.5em'}}>{password}</dd>
                </dl>
                <dl>
                    <dt>Disabled:</dt>
                    <dd>{disabled.toString()}</dd>
                </dl>
                <dl style={{marginBottom: '1.5em'}}>
                    <dt>Authorized:</dt>
                    <dd>{authorized.toString()}</dd>
                </dl>
                <Button onClick={this.props.onEdit}>Edit</Button>
                <Button floated='right' onClick={this.handleDelete} negative>Delete</Button>
            </Segment>
        );
    }

    handleDelete = () => this.props.onDelete(this.props.user);
}
