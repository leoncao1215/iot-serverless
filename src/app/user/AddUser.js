import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName     : '',
            password       : '',
            disabled    :   false,
            authorized  :   false,
            userNameError   :   null,
            passwordError   :   null,
            message          : null,
        }
    }

    get message() {
        switch (this.state.message) {
            case 'success':
                return (
                    <Message
                        success
                        header='Success'
                        content="You've successfully added a user. User list will be refreshed in 3 seconds."
                    />
                );
            case 'error':
                return (
                    <Message
                        error
                        header='Fail to add user'
                        content='Please check your user info and try again later.'
                    />
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <Segment>
                <Header as='h1'>Add User</Header>
                {this.message}
                <Form>
                    <Form.Field required>
                        <label>User Name</label>
                        <Form.Input
                            placeholder='User Name'
                            name='userName'
                            value={this.state.userName}
                            onChange={this.handleChange}
                            error={this.state.userNameError}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Password</label>
                        <Form.Input
                            placeholder='Password'
                            name='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            error={this.state.passwordError}/>
                    </Form.Field>
                    <Button.Group>
                        <Button onClick={this.handleSubmit} positive>Submit</Button>
                        <Button.Or/>
                        <Button onClick={this.props.onCancel}>Cancel</Button>
                    </Button.Group>
                </Form>
            </Segment>
        );
    }

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    };

    handleSubmit = () => {
        const {userName, password, disabled, authorized} = this.state;
        let hasError                                     = false;
        if (!userName) {
            hasError = true;
            this.setState({userNameError: 'Please Input User Name'})
        } else {
            this.setState({userNameError: null})
        }
        if (!password) {
            hasError = true;
            this.setState({passwordError: 'Please Input Password'})
        } else {
            this.setState({passwordError: null})
        }
        if (!hasError) {
            const user        = {
                userName, password, disabled, authorized
            };
            const handleSuccess = this.props.onSuccess;
            console.log(user);
            request.post('/addUser', user)
                .then(res => {
                    const code = res.code;
                    if (code !== 200) {
                        console.log(res.message);
                        this.setState({message: 'error'});
                    } else {
                        this.setState({message: 'success'});
                        setTimeout(() => {
                            this.setState({message: null});
                            handleSuccess();
                        }, 3000);
                    }
                });
        }
    }
}
