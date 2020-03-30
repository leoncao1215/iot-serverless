import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Device from './device/Device'
import './App.scss';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/device">Device</Link></li>
            </ul>
          </nav>
          <Switch>
            <Route path="/device">
              <Device/>
            </Route>
            <Route path="/">
              <div>Home Page</div>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  };
}

export default App;
