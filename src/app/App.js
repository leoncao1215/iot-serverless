import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  Container,
  Image,
  Menu, Segment,
} from 'semantic-ui-react'
import Device from './device/Device'
import Scene from './scene/Scene'
import './App.scss';
import Exception from './exception/Exception';
import User from './user/User';
import History from "./history/History";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Menu inverted>
            <Container>
              <Menu.Item as='a' header>
                <Image size='mini' src='logo192.png' style={{marginRight: '1.5em'}}/>
                IoT-Serverless
              </Menu.Item>
              <Menu.Item as={Link} to="/">Home</Menu.Item>
              <Menu.Item as={Link} to="/device">Device</Menu.Item>
              <Menu.Item as={Link} to="/scene">Scene</Menu.Item>
              <Menu.Item as={Link} to="/history">History</Menu.Item>
              <Menu.Item as={Link} to="/exception">Exception</Menu.Item>
              <Menu.Item as={Link} to="/user">User</Menu.Item>
            </Container>
          </Menu>
          <Container style={{minHeight: '85vh'}}>
            <Switch>
              <Route path="/device">
                <Device/>
              </Route>
              <Route path="/scene">
                <Scene/>
              </Route>
              <Route path="/history">
                <History/>
              </Route>
              <Route path="/exception">
                <Exception/>
              </Route>
              <Route path="/user">
                <User/>
              </Route>
              <Route path="/">
                <div>Home Page</div>
              </Route>
            </Switch>
          </Container>
          <Segment inverted vertical style={{margin: '5em 0em 0em', padding: '5em 0em'}}>
            <Container textAlign='center'>
              All right reserved.
            </Container>
          </Segment>
        </div>
      </Router>
    )
  };
}

export default App;
