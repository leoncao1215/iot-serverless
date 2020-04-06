import React from "react";
import {Button, Form, Header, Message, Segment} from "semantic-ui-react";
import request from "../../util/request-util";

export default class AddScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serialNumber     : '',
            sceneName        : '',

            condTypes        : [],
            condType         : '',

            conds            : {},
            cond             : '',

            devices          : [],
            device           : '',

            operations       : [],
            operation        : '',

            serialNumberError: null,
            sceneNameError   : null,
            condTypeError    : null,
            condError        : null,
            operationError   : null,
            message          : null,
        }
    }

    componentDidMount() {
        this.fetchConds();
    }

    fetchConds = () => {
        request.get('/queryCondList')
            .then(res => {
                let conds = [];
                let condTypes = [];
                let condTypeT = [];
                res.conds.map(cond => {
                    if (condTypeT.indexOf(cond.type) < 0){
                        condTypeT.push(cond.type);
                        condTypes.push({
                            key: cond.type,
                            value: cond.type,
                            text: cond.type,
                        });
                        conds[cond.type] = [];
                    }
                    conds[cond.type].push({
                        key: cond.serialNumber,
                        value: cond.serialNumber,
                        text: cond.desc,
                    })
                });
                this.setState({
                    condTypes: condTypes,
                    conds: conds
                })
            });
    };

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
                        <label>Trigger Condition Type</label>
                        <Form.Dropdown
                            fluid search selection required
                            placeholder='Trigger Condition Type'
                            options={this.state.condTypes}
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
                            options={this.state.conds[this.state.condType]}
                            name='cond'
                            value={this.state.cond}
                            onChange={this.handleChange}
                            error={this.state.condError}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>Device Operation</label>
                        <Form.Dropdown
                            fluid search selection required
                            placeholder='Device Operation'
                            options={this.operations}
                            name='operation'
                            value={this.state.operation}
                            onChange={this.handleChange}
                            error={this.state.operationError}
                        />
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
        const {serialNumber, sceneName, condType, cond, operation} = this.state;
        let hasError = false;
        if (!serialNumber) {
            hasError = true;
            this.setState({serialNumberError: 'Please Input Serial Number'})
        } else {
            this.setState({serialNumberError: null})
        }
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
        if (!operation) {
            hasError = true;
            this.setState({operationError: 'Please Select Device Operation'})
        } else {
            this.setState({operationError: null})
        }
        if (!hasError) {
            const scene        = {
                serialNumber, sceneName, condType, cond, operation
            };
            const handleSuccess = this.props.onSuccess;
            console.log(scene);
            request.post('/addScene', scene)
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
