import React from "react";
import request from "../../util/request-util";
import {Button, Dropdown, Header, Icon, Menu, Table,Loader} from "semantic-ui-react";

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyList:"",
            devices:"",
            curDevice:"",
            sumDevice:"",
            sumTime:"",
            sumCost:""
        }
    }

    componentDidMount() {
        this.fetchHistory();
    }

    fetchHistory= (device) => {
        if (!device) {
            request.get('/queryHistoryList')
                .then(res => {
                    if (res.historyList) {
                        let set = new Set();
                        res.historyList.forEach((his)=>{
                            set.add(his.device)
                        })
                        this.setState({
                            historyList: res.historyList,
                            devices:Array.from(set),
                        })
                        this.CalTimeAndCost(res.historyList)
                    }
                });
        } else {
            request.get(`/queryHistoryListByDevice?device=${device}`)
                .then(res => {
                    if (res.historyList) {
                        this.setState({
                            historyList: res.historyList
                        })
                        this.CalTimeAndCost(res.historyList)
                    }
                });
        }
    }

    handleChangeDevice= (e, data) => {
        this.setState({
            curDevice:data.value
        })
    }
    handleFilter = () => {
        const {curDevice} = this.state;
        this.setState({
            sumDevice:curDevice
        })
        this.fetchHistory(curDevice === 'none' ? undefined : curDevice);
    }

    onDelete(id){
        request.delete(`/deleteHistory?historyId=${id}`)
            .then(res => {
                this.setState({
                    curDevice:""
                })
                this.handleFilter()
            })
    }

    CalTimeAndCost(list){
        let time=0,cost=0;
        list.forEach((history)=>{
            time+=Number(history.total_time);
            cost+=Number(history.Electricity_Consumption);
        })
        this.setState({
            sumTime:time,
            sumCost:cost,
        })
    }

    render() {
        if(this.state.historyList===""){
            return <Loader/>
        }
        //console.log("state:",this.state.devices)
        return(
            <div>
                {this.historyTable}
            </div>
        )
    }

    get historyTable() {
        let options = this.state.devices.map(device => {return {key: device, value: device, text: device}});
        options.unshift({key: 'none', value: 'none', text: '-- none --'})

        return (
            <div>
                <div className="history-list">
                    <Header as='h1' floated='left'>History List</Header>
                    <Dropdown search selection onChange={this.handleChangeDevice}
                              placeholder='Filter device' options={options}/>
                    <Button basic onClick={this.handleFilter} style={{marginLeft: '.5em'}}>Filter</Button>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Device</Table.HeaderCell>
                                <Table.HeaderCell>StartTime</Table.HeaderCell>
                                <Table.HeaderCell>EndTime</Table.HeaderCell>
                                <Table.HeaderCell>Duration</Table.HeaderCell>
                                <Table.HeaderCell>Electricity Consumption</Table.HeaderCell>
                                <Table.HeaderCell>del</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.historyList.map(history =>
                                <Table.Row key={history.historyId}>
                                    <Table.Cell collapsing>{history.device}</Table.Cell>
                                    <Table.Cell collapsing>{history.start_time}</Table.Cell>
                                    <Table.Cell collapsing>{history.end_time}</Table.Cell>
                                    <Table.Cell collapsing>{history.total_time} H</Table.Cell>
                                    <Table.Cell collapsing>{history.Electricity_Consumption} wh</Table.Cell>
                                    <Table.Cell collapsing><Button onClick={this.onDelete.bind(this,history.historyId)} negative>Delete</Button></Table.Cell>
                                </Table.Row>
                            )}
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

                <div>
                    <Header as='h3' floated='left'>History Summary</Header>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Device</Table.HeaderCell>
                                <Table.HeaderCell>Duration_Sum</Table.HeaderCell>
                                <Table.HeaderCell>Consumption_Sum</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Cell collapsing>{this.state.sumDevice===""?"All":this.state.sumDevice}</Table.Cell>
                            <Table.Cell collapsing>{this.state.sumTime} H</Table.Cell>
                            <Table.Cell collapsing>{this.state.sumCost} wh</Table.Cell>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        )
    }
}