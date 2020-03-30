import React from 'react';
import './App.scss';

const baseURL = 'http://localhost:8080/dev';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    fetch(`${baseURL}/world`, {
      method: 'GET',
      mode  : 'cors'
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        data: res
      });
    }).catch((err) => {
      console.log('error: ', err);
    });
  }

  render() {
    return (
      <div className="App">
        {JSON.stringify(this.state.data)}
      </div>
    )
  };
}

export default App;
