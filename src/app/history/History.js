import React from "react";
import request from "../../util/request-util";
import {Button, Dropdown, Header, Icon, Menu, Table,Loader} from "semantic-ui-react";

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyList:"",
            devices:"",
            dates:"",

            curDevice:"",
            curDate:"",

            sumDate:"",
            sumDevice:"",
            sumTime:"",
            sumCost:"",

            deviceFilter:true,
        }
    }

    componentDidMount() {
        this.fetchHistoryByDevice();
    }

    fetchHistoryByDevice(){
        if (this.state.curDevice===""||this.state.curDevice==="none") {
            request.get('/queryHistoryList')
                .then(res => {
                    if (res.historyList) {
                        let deviceSet = new Set();
                        let dateSet = new Set();

                        res.historyList.forEach((his)=>{
                            deviceSet.add(his.device)
                            dateSet.add(his.day)
                        });

                        this.setState({
                            historyList: res.historyList,
                            devices:Array.from(deviceSet),
                            dates:Array.from(dateSet)
                        })
                        this.CalTimeAndCost(res.historyList)
                    }
                });
        } else {
            request.get(`/queryHistoryListByDevice?device=${this.state.curDevice}`)
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

    fetchHistoryByDate(){
        if (this.state.curDate===""||this.state.curDate==="none") {
            request.get('/queryHistoryList')
                .then(res => {
                    if (res.historyList) {
                        let deviceSet = new Set();
                        let dateSet = new Set();

                        res.historyList.forEach((his)=>{
                            deviceSet.add(his.device)
                            dateSet.add(his.day)
                        });

                        this.setState({
                            historyList: res.historyList,
                            devices:Array.from(deviceSet),
                            dates:Array.from(dateSet)
                        })
                        this.CalTimeAndCost(res.historyList)
                    }
                });
        } else {
            request.get(`/queryHistoryByDate?date=${this.state.curDate}`)
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
    handleDeviceFilter = () => {
        const {curDevice} = this.state;
        this.setState({
            sumDevice:curDevice,
            deviceFilter:true,
        })
        this.fetchHistoryByDevice();
    }

    handleChangeDate= (e, data) => {
        this.setState({
            curDate:data.value
        })
    }
    handleDateFilter = () => {
        const {curDate} = this.state;
        this.setState({
            sumDate:curDate,
            deviceFilter:false,
        })
        this.fetchHistoryByDate();
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
        let DeviceOptions = this.state.devices.map(device => {return {key: device, value: device, text: device}});
        DeviceOptions.unshift({key: 'none', value: 'none', text: '-- none --'})

        let DateOptions = this.state.dates.map(date => {return {key: date, value: date, text: date}});
        DateOptions.unshift({key: 'none', value: 'none', text: '-- none --'})

        return (
            <div>
                <div className="history-list">
                    <Header as='h1' floated='left'>History List</Header>
                    <Dropdown search selection onChange={this.handleChangeDevice}
                              placeholder='Filter device' options={DeviceOptions}/>
                    <Button basic onClick={this.handleDeviceFilter} style={{marginLeft: '.5em'}}>Filter</Button>

                    <Dropdown search selection onChange={this.handleChangeDate}
                              placeholder='Filter date' options={DateOptions}/>
                    <Button basic onClick={this.handleDateFilter} style={{marginLeft: '.5em'}}>Filter</Button>

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
                {
                    this.state.deviceFilter?
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
                                    <Table.Cell collapsing>{this.state.sumDevice===""||this.state.sumDevice==="none"?
                                        "All":this.state.sumDevice}</Table.Cell>
                                    <Table.Cell collapsing>{this.state.sumTime} H</Table.Cell>
                                    <Table.Cell collapsing>{this.state.sumCost} wh</Table.Cell>
                                </Table.Body>
                            </Table>
                        </div>
                        :
                        <div>
                            <Header as='h3' floated='left'>History Summary</Header>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Date</Table.HeaderCell>
                                        <Table.HeaderCell>Duration_Sum</Table.HeaderCell>
                                        <Table.HeaderCell>Consumption_Sum</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Cell collapsing>{this.state.sumDate===""||this.state.sumDate==="none"?
                                        "All":this.state.sumDate}</Table.Cell>
                                    <Table.Cell collapsing>{this.state.sumTime} H</Table.Cell>
                                    <Table.Cell collapsing>{this.state.sumCost} wh</Table.Cell>
                                </Table.Body>
                            </Table>
                        </div>
                }

            </div>
        )
    }
}