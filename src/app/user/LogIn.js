import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class LogIn extends React.Component {
    constructor(props) {
        super(props);
        const {user} = this.props;
        this.state = {
            userId      : user.userId,
            userName     : user.userName,
            password       : user.password,
            disabled    :   user.disabled,
            authorized  :   user.authorized,
            isOnline  :   user.isOnline,
            passwordError   :   null,
            message          : null,
            inputPassword   :   ''
        }
    }

    get message() {
        switch (this.state.message) {
            case 'success':
                return (
                    <Message
                        success
                        header='Success'
                        content="You've successfully log in. User list will be refreshed in 3 seconds."
                    />
                );
            case 'error':
                return (
                    <Message
                        error
                        header='Fail to log in'
                        content='Please check your password and try again later.'
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
                isOnline      :   this.props.user.isOnline
            })
        }
    }

    render() {
        return (
            <Segment clearing>
                {this.message}
                <Header as='h1'>Log In: {this.state.userName}</Header>
                <Form>
                    <Form.Field required>
                        <label>Password</label>
                        <Form.Input
                            type='password'
                            placeholder='Password'
                            name='inputPassword'
                            value={this.state.inputPassword}
                            onChange={this.handleChange}
                            error={this.state.passwordError}/>
                    </Form.Field>
                    <Button.Group floated='left'>
                        <Button onClick={this.handleLogIn} positive>Log in</Button>
                        <Button.Or/>
                        <Button onClick={this.props.onCancel}>Cancel</Button>
                    </Button.Group>
                </Form>
            </Segment>
        );
    }

    handleChange = (e, {name, value}) => {
        this.setState({isOnline: true});
        this.setState({[name]: value})
    };

    handleLogIn = () => {
        const {password, inputPassword} = this.state;
        let hasError                                     = false;
        if (!inputPassword) {
            hasError = true;
            this.setState({passwordError: 'Please Input Password'})
        } else if(!(password === inputPassword)){
            hasError = true;
            this.setState({passwordError: 'Wrong Password'})
        }
        else {
            this.setState({passwordError: null})
        }
        if (!hasError) {
            this.handleOnline();
            const {userId, userName, disabled, authorized, isOnline} = this.state;
            const user        = {
                userId, userName, password, disabled, authorized, isOnline
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
    };

    handleOnline = () => {
        this.setState({isOnline: !this.state.isOnline});
    };

}
