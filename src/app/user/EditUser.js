import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class EditUser extends React.Component {
    constructor(props) {
        super(props);
        const {user} = this.props;
        this.state = {
            userId      : user.userId,
            userName     : user.userName,
            password       : user.password,
            disabled    :   user.disabled,
            authorized  :   user.authorized,
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
                        content="You've successfully update user info. User list will be refreshed in 3 seconds."
                    />
                );
            case 'error':
                return (
                    <Message
                        error
                        header='Fail to update user'
                        content='Please check your user info and try again later.'
                    />
                );
            default:
                return null;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({
                userId      : this.props.user.userId,
                userName     : this.props.user.userName,
                password       : this.props.user.password,
                disabled    :   this.props.user.disabled,
                authorized  :   this.props.user.authorized,
            })
        }
    }

    render() {
        return (
            <Segment clearing>
                {this.message}
                <Header as='h1'>Editing User: {this.state.userName}</Header>
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
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label='Disable user'
                            name='disabled'
                            checked={this.state.disabled}
                            onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label='Authorize user'
                            name='authorized'
                            checked={this.state.authorized}
                            onChange={this.handleChange}/>
                    </Form.Field>
                    <Button.Group floated='left'>
                        <Button onClick={this.handleSubmit} positive>Submit</Button>
                        <Button.Or/>
                        <Button onClick={this.props.onCancel}>Cancel</Button>
                    </Button.Group>
                    <Button floated='right' onClick={this.handleDelete} negative>Delete</Button>
                </Form>
            </Segment>
        );
    }

    handleChange = (e, {name, value}) => {
        if (name === 'disabled') {
            this.setState({disabled: !this.state.disabled})
        } else if (name === 'authorized'){
            this.setState({authorized: !this.state.authorized})
        }
        else {
            this.setState({[name]: value})
        }
    };

    handleSubmit = () => {
        const {userId, userName, password, disabled, authorized} = this.state;
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
                userId, userName, password, disabled, authorized
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

    handleDelete = () => this.props.onDelete(this.props.user);
}
