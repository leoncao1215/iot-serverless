import request from "../../util/request-util";
import React from "react";

export default class Device extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    request.get('/queryDeviceList')
      .then(res =>
        this.setState({
          data: res
        })
      );
  }

  render() {
    return (
      <div className="device-list">
        {JSON.stringify(this.state.data, null, 2)}
      </div>
    )
  };
}
