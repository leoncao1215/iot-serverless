import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class AddScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serialNumber     : '',
            sceneName        : '',
            type             : '',
            disabled         : false,
            serialNumberError: null,
            sceneNameError   : null,
            typeError        : null,
            message          : null,
        }
    }

    get typeOptions() {
        return [
            {key: 'Light', value: 'Light', text: 'Light'},
            {key: 'Sensor', value: 'Sensor', text: 'Sensor'},
            {key: 'Switcher', value: 'Switcher', text: 'Switcher'},
        ]
    }

    get message() {
        switch (this.state.message) {
            case 'success':
                return (
                    <Message
                        success
                        header='Success'
                        content="You've successfully added a scene. Scene list will be refreshed in 3 seconds."
                    />
                );
            case 'error':
                return (
                    <Message
                        error
                        header='Fail to add scene'
                        content='Please check your scene info and try again later.'
                    />
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <Segment>
                <Header as='h1'>Add Scene</Header>
                {this.message}
                <Form>
                    <Form.Field required>
                        <label>Serial Number</label>
                        <Form.Input
                            placeholder='Serial Number'
                            name='serialNumber'
                            value={this.state.serialNumber}
                            onChange={this.handleChange}
                            error={this.state.serialNumberError}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Scene Name</label>
                        <Form.Input
                            placeholder='Scene Name'
                            name='sceneName'
                            value={this.state.sceneName}
                            onChange={this.handleChange}
                            error={this.state.sceneNameError}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Device Type</label>
                        <Form.Dropdown
                            fluid search selection required
                            placeholder='Select Device Type'
                            options={this.typeOptions}
                            name='type'
                            value={this.state.type}
                            onChange={this.handleChange}
                            error={this.state.typeError}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label='Disable device'
                            name='disabled'
                            checked={this.state.disabled}
                            onChange={this.handleChange}/>
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
        if (name === 'disabled') {
            this.setState({disabled: !this.state.disabled})
        } else {
            this.setState({[name]: value})
        }
    };

    handleSubmit = () => {
        const {serialNumber, sceneName, type, disabled} = this.state;
        let hasError                                     = false;
        if (!serialNumber) {
            hasError = true;
            this.setState({serialNumberError: 'Please Input Serial Number'})
        } else {
            this.setState({serialNumberError: null})
        }
        if (!sceneName) {
            hasError = true;
            this.setState({sceneNameError: 'Please Input Device Name'})
        } else {
            this.setState({sceneNameError: null})
        }
        if (!type) {
            hasError = true;
            this.setState({typeError: 'Please Select Device Type'})
        } else {
            this.setState({typeError: null})
        }
        if (!hasError) {
            const device        = {
                serialNumber, sceneName, type, disabled
            };
            const handleSuccess = this.props.onSuccess;
            console.log(device);
            request.post('/addDevice', device)
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
