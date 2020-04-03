import request from "../../util/request-util";
import React from "react";
import {Table, Menu, Icon, Button, Header, Segment, Select, Dropdown} from "semantic-ui-react";
import AddException from "./AddException";
import EditException from "./EditException";
import ViewException from "./ViewException";

export default class Exception extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exceptions  : [],
      types    : [],
      action   : '',
      curException: {}
    }
  }

  componentDidMount() {
    this.fetchExceptions();
  }

  render() {
    return (
      <div>
        {this.exceptionTable}
        {this.actionPane}
      </div>
    )
  };

  fetchExceptions = () => {
      request.get('/queryExceptionList')
        .then(res =>
          this.setState({
            exceptions: res.exception
          })
        );
   
  };
  get exceptionTable() {
    const getExceptionStatus = (exception) => {
      if (exception.isresolved) {
        return 'Yes';
      } else {
        return 'No';
      }
    };
    return (
      <div>
        <div className="exception-list">
          <Header as='h1' floated='left'>Exceptions List</Header>
          <Button basic floated='right' color='green' onClick={this.handleAddException}>Add Exception</Button>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Serial Number</Table.HeaderCell>
                <Table.HeaderCell>Exception Code</Table.HeaderCell>
                <Table.HeaderCell>Exception Content</Table.HeaderCell>
                <Table.HeaderCell>Exception Time</Table.HeaderCell>
                <Table.HeaderCell>IsResolve</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.state.exceptions.map(exception =>
                <Table.Row>
                  <Table.Cell collapsing>{exception.serialNumber}</Table.Cell>
                  <Table.Cell collapsing>{exception.exceptionCode}</Table.Cell>

                  <Table.Cell>{exception.exceptionContent}</Table.Cell>
                  <Table.Cell collapsing>{exception.time}</Table.Cell>
                  <Table.Cell collapsing>{exception.isresolved?"Yes":"No"}</Table.Cell>
                  <Table.Cell collapsing>
                    <Button.Group>
                      <Button positive onClick={() => this.handleViewException(exception)}>View</Button>
                      <Button.Or/>
                      <Button onClick={() => this.handleEditException(exception)}>Edit</Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='5'>
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
    const {curException} = this.state;
    switch (this.state.action) {
      case 'add':
        return (
          <AddException
            onSuccess={this.handleSuccess}
            onCancel={this.handleCancel}/>
        );
      case 'view':
        return (
          <ViewException
            exception={curException}
            onSuccess={this.handleSuccess}
            onEdit={() => this.handleEditException()}
            onDelete={this.handleDelete}/>
        );
      case 'edit':
        return (
          <EditException
            exception={curException}
            onSuccess={this.handleSuccess}
            onCancel={() => this.handleViewException()}
            onDelete={this.handleDelete}/>
        );
      default:
        return undefined;
    }
  }
  handleAddException = () => {
    this.setState({
      action: 'add'
    })
  };

  handleViewException = (exception) => {
    if (exception) {
      this.setState({
        action   : 'view',
        curException: exception
      })
    } else {
      this.setState({
        action: 'view',
      })
    }
  };

  handleEditException = (exception) => {
    if (exception) {
      this.setState({
        action   : 'edit',
        curException: exception
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
    this.fetchExceptions();
  };

  handleDelete = (exception) => {
   
  };
}
