import React from "react";
import {Button, Header, Segment} from "semantic-ui-react";
import './ViewScene.scss';

export default class ViewScene extends React.Component {
    constructor(props) {
        super(props);
        const {scene} = this.props;
        this.state     = {
            serialNumber: scene.serialNumber,
            sceneName   : scene.sceneName,
            condType    : scene.condType,
            cond        : scene.cond,
            condDesc    : scene.condDesc,
            device      : scene.device,
            operation   : scene.operation,
        }
    }

    render() {
        const {serialNumber, sceneName, condType, condDesc, device, operation} = this.props.scene;
        return (
            <Segment clearing className='scene-detail'>
                <Header as='h1'>Viewing Scene: {sceneName}</Header>
                <dl>
                    <dt>Serial Number:</dt>
                    <dd style={{marginLeft: '.5em'}}>{serialNumber}</dd>
                </dl>
                <dl>
                    <dt>Scene Name:</dt>
                    <dd style={{marginLeft: '.5em'}}>{sceneName}</dd>
                </dl>
                <dl>
                    <dt>Condition Type:</dt>
                    <dd>{condType}</dd>
                </dl>
                <dl>
                    <dt>Condition:</dt>
                    <dd>{condDesc}</dd>
                </dl>
                <dl>
                    <dt>Device:</dt>
                    <dd>{device}</dd>
                </dl>
                <dl style={{marginBottom: '1.5em'}}>
                    <dt>Operation:</dt>
                    <dd>{operation}</dd>
                </dl>
                <Button onClick={this.props.onEdit}>Edit</Button>
                <Button floated='right' onClick={this.props.onDelete} negative>Delete</Button>
            </Segment>
        );
    }
}
