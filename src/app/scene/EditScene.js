import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class EditScene extends React.Component {
    constructor(props) {
        super(props);
        const {scene} = this.props;
        this.state = {
            condTypeOptions  : [],
            condOptions      : {},
            conds            : {},
            deviceOptions    : [],

            serialNumber     : scene.serialNumber,
            sceneName        : scene.sceneName,
            condType         : scene.condType,
            cond             : scene.cond,
            condDesc         : scene.condDesc,
            device           : scene.device,
            deviceName       : scene.deviceName,
            operation        : scene.operation,
            isUsing          : scene.isUsing,

            serialNumberError: null,
            sceneNameError   : null,
            condTypeError    : null,
            condError        : null,
            deviceError      : null,
            operationError   : null,
        }
    }

    componentDidMount() {
        this.fetchConds();
        this.fetchDevices();
    }

    fetchConds = () => {
        request.get('/queryCondList')
            .then(res => {
                let condOptions = [];
                let condTypeOptions = [];
                let condTypeT = [];
                let conds = {};
                res.conds.map(cond => {
                    conds[cond.serialNumber] = cond;
                    if (condTypeT.indexOf(cond.type) < 0){
                        condTypeT.push(cond.type);
                        condTypeOptions.push({
                            key: cond.type,
                            value: cond.type,
                            text: cond.type,
                        });
                        condOptions[cond.type] = [];
                    }
                    if (cond.type === 'time'){
                        condOptions[cond.type].push({
                            key: cond.hour * 100 + cond.minute,
                            value: cond.serialNumber,
                            text: cond.desc,
                        });
                    } else if (cond.type === 'brightness'){
                        condOptions[cond.type].push({
                            key: cond.brightness,
                            value: cond.serialNumber,
                            text: cond.desc,
                        });
                    } else if (cond.type === 'temperature'){
                        condOptions[cond.type].push({
                            key: cond.temperature,
                            value: cond.serialNumber,
                            text: cond.desc,
                        });
                    }
                    return null;
                });
                this.setState({
                    condTypeOptions : condTypeOptions,
                    condOptions     : condOptions,
                    conds           : conds,
                })
            });
    };

    fetchDevices = () => {
        request.get('/queryDeviceList')
            .then(res => {
                let deviceOptions = [];
                let devices = {};
                res.devices.map(device => {
                    devices[device.serialNumber] = device;
                    deviceOptions.push({
                        key: device.serialNumber,
                        value: device.serialNumber + '_' + device.deviceName,
                        text: device.serialNumber + ' ' + device.deviceName,
                    });
                    return null;
                });
                this.setState({
                    deviceOptions : deviceOptions,
                    devices       : devices,
                })
            });
    };

    get opOptions() {
        return [
            {key: 'turn on', value: 'turn on', text: 'turn on' },
            {key: 'turn off', value: 'turn off', text: 'turn off' },
        ]
    }

    get message() {
        switch (this.state.message) {
            case 'success':
                return (
                    <Message
                        success
                        header='Success'
                        content="Successfully update scene info. Web will be refreshed in 2 seconds."
                    />
                );
            case 'error':
                return (
                    <Message
                        error
                        header='Fail to update scene'
                        content='Please check your scene info and try again later.'
                    />
                );
            default:
                return null;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.scene !== this.props.scene) {
            this.setState({
                serialNumber: this.props.scene.serialNumber,
                sceneName   : this.props.scene.sceneName,
                condType    : this.props.scene.condType,
                cond        : this.props.scene.cond,
                condDesc    : this.props.scene.condDesc,
                device      : this.props.scene.device,
                deviceName  : this.props.scene.deviceName,
                operation   : this.props.scene.operation,
            })
        }
    }

    render() {
        return (
            <Segment clearing>
                {this.message}
                <Header as='h1'>Editing Scene: {this.state.serialNumber}</Header>
                <Form>
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
                        <label>Trigger Condition Type</label>
                        <Form.Dropdown
                            fluid search selection required
                            placeholder='Trigger Condition Type'
                            options={this.state.condTypeOptions}
                            name='condType'
                            value={this.state.condType}
                            onChange={this.handleChange}
                            error={this.state.condTypeError}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>Trigger Condition</label>
                        <Form.Dropdown
                            fluid search selection required
                            placeholder='Trigger Condition Type'
                            options={this.state.condOptions[this.state.condType]}
                            name='cond'
                            value={this.state.cond}
                            onChange={this.handleChange}
                            error={this.state.condError}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>Device</label>
                        <Form.Dropdown
                            fluid search selection required
                            placeholder='Device'
                            options={this.state.deviceOptions}
                            name='device'
                            value={this.state.device + '_' + this.state.deviceName}
                            onChange={this.handleChange}
                            error={this.state.deviceError}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>Device Operation</label>
                        <Form.Dropdown
                            fluid search selection required
                            placeholder='Device Operation'
                            options={this.opOptions}
                            name='operation'
                            value={this.state.operation}
                            onChange={this.handleChange}
                            error={this.state.operationError}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label={this.state.isUsing ? 'Use Scene': 'Not Use Scene'}
                            name='isUsing'
                            checked={this.state.isUsing}
                            onChange={this.handleChange}/>
                    </Form.Field>
                    <Button.Group floated='left'>
                        <Button onClick={this.handleSubmit} positive>Submit</Button>
                        <Button.Or/>
                        <Button onClick={this.props.onCancel}>Cancel</Button>
                    </Button.Group>
                    <Button floated='right' onClick={this.props.onDelete} negative>Delete</Button>
                </Form>
            </Segment>
        );
    }

    handleChange = (e, {name, value}) => {
        if (name === 'isUsing') {
            this.setState({isUsing: !this.state.isUsing})
        } else {
            this.setState({[name]: value})
        }
    };

    handleSubmit = () => {
        const {serialNumber, sceneName, condType, cond, condDesc, operation, isUsing} = this.state;
        const deviceT = this.state.device;
        let hasError = false;
        if (!sceneName) {
            hasError = true;
            this.setState({sceneNameError: 'Please Input Scene Name'})
        } else {
            this.setState({sceneNameError: null})
        }
        if (!condType) {
            hasError = true;
            this.setState({condTypeError: 'Please Select Trigger Condition Type'})
        } else {
            this.setState({condTypeError: null})
        }
        if (!cond) {
            hasError = true;
            this.setState({condError: 'Please Select Trigger Condition'})
        } else {
            this.setState({condError: null})
        }
        if (!deviceT) {
            hasError = true;
            this.setState({deviceError: 'Please Select Device'})
        } else {
            this.setState({deviceError: null})
        }
        if (!operation) {
            hasError = true;
            this.setState({operationError: 'Please Select Device Operation'})
        } else {
            this.setState({operationError: null})
        }
        if (!hasError) {
            const [device, deviceName] = deviceT.split('_');
            const scene = {
                serialNumber, sceneName, condType, cond, condDesc, device, deviceName, operation, isUsing
            };
            const handleSuccess = this.props.onSuccess;
            console.log(scene);
            request.post('/updateScene', scene)
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
                        }, 2000);
                    }
                });
        }
    }
}
