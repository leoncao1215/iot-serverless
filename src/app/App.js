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
  Menu,
} from 'semantic-ui-react'
import Device from './device/Device'
import './App.scss';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Menu inverted>
            <Container>
              <Menu.Item as='a' header>
                <Image size='mini' src='logo192.png' style={{ marginRight: '1.5em' }} />
                IoT-Serverless
              </Menu.Item>
              <Menu.Item as='a'><Link to="/">Home</Link></Menu.Item>
              <Menu.Item as='a'><Link to="/device">Device</Link></Menu.Item>
            </Container>
          </Menu>
          <Container>
            <Switch>
              <Route path="/device">
                <Device/>
              </Route>
              <Route path="/">
                <div>Home Page</div>
              </Route>
            </Switch>
          </Container>
        </div>
      </Router>
    )
  };
}

export default App;
