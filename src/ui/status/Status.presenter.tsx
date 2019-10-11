import React, { Component } from "react";

const API = process.env.REACT_APP_API_ENDPOINT;
const STATUS_QUERY = "/v1/status";
const MICRO_STATUS_QUERY = "/v1/micro/healthcheck";

interface StatusState {
    data: Object
    data1: Object
}

interface StatusProps {
}

class StatusPresenter extends React.Component<StatusProps, StatusState> {

  constructor() {
    super({}, { data: null, data1: null });
  }

  componentDidMount() {
    fetch(API + STATUS_QUERY)
    .then(res => res.text())
    .then(
      (result) => {
        let dict = JSON.parse(result);
        //console.log("Dict 2: " + dict);
        this.setState({ data: dict });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error)
      }
    );
    fetch(API + MICRO_STATUS_QUERY)
    .then(res => res.text())
    .then(
      (result) => {
        let dict = JSON.parse(result);
        //console.log("Dict 3: " + dict);
        this.setState({ data1: dict });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error)
      }
    );
  }

  render() {
    let dict = require('../../data/buildInfo.json');
    //console.log("Dict: " + dict);
    var index = 0;
    let elements = Object.keys(dict).map((key) => {
      index += 1; 
      return (
        <tr key={index}>
          <td><b>{key}: </b></td>
          <td>{dict[key]}</td>
        </tr>
      )
    })
    return (
      <div style={{padding: '10px'}}>
        <h1>Build Info [Frontend]</h1>
        <table style={{fontSize: '20px'}}>
          <tbody>
            {elements}
          </tbody>
        </table>
        <br/>
        <h1>Build Info [Backend]</h1>
        <table style={{fontSize: '20px'}}>
          <tbody>
            { this.state && this.state.data &&
              Object.keys(this.state.data).map((key) => (
                  <tr key={key}>
                    <td><b>{key}: </b></td>
                    <td>{(this.state.data as any)[key]}</td>
                  </tr>
              ))
            }
          </tbody>
        </table>
        <br/>
        <h1>Background Worker Service</h1>
        <table style={{fontSize: '20px'}}>
          <tbody>
            { this.state && this.state.data1 &&
              Object.keys(this.state.data1).map((key) => (
                  <tr key={key}>
                    <td><b>{key}: </b></td>
                    <td>{(this.state.data1 as any)[key] == true ? "true" : "false"}</td>
                  </tr>
              ))
            }
          </tbody>
        </table>
      </div>    
    )
  }
}

export default StatusPresenter;