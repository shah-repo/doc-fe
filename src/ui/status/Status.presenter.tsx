/* eslint-disable no-console */
import React from "react";
import Config from "../../config";
import { getRemoteValidatorBundle } from "./../remoteValidators/RemoteValidators";

const API = Config.ApiEndpoint;
const WORKER_API = Config.WorkerApiEndpoint;
const STATUS_QUERY = "/status";
const MICRO_STATUS_QUERY = "/micro/healthcheck";

interface StatusState {
  backend: object;
  bgWorker: object;
  remoteJS: object;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StatusProps {}

class StatusPresenter extends React.Component<StatusProps, StatusState> {

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(props) {
    super(props);
    this.state =  { backend: {}, remoteJS: {}, bgWorker: {} };
  }

  toSnakeCase(str) {
    return str.trim().toLowerCase().split(/[ ]+/).join("-");
  }

  public componentDidMount() {
    fetch(API + STATUS_QUERY)
      .then((res) => res.text())
      .then(
        (result) => {
          const dict = JSON.parse(result);
          // console.log("Dict 2: " + dict);
          this.setState({ backend: dict });
        },
        (error) => {
          console.log(error);
        },
      );
    fetch((WORKER_API || API) + MICRO_STATUS_QUERY)
      .then((res) => res.text())
      .then(
        (result) => {
          const dict = JSON.parse(result);
          this.setState({ bgWorker: dict });
        },
        (error) => {
          console.log(error);
        },
      );
    getRemoteValidatorBundle()
      .then(
        (result) => {
          const dict = result?.buildInfo;
          if (dict) {
            this.setState({ remoteJS: dict });
          } else {
            this.setState({ remoteJS: { Status: "You have to be logged in" } });
          }
        },
        (error) => {
          console.log(error);
        },
      );
  }

  buildElements(nameRaw, dict) {
    const name = this.toSnakeCase(nameRaw);
    return Object.keys(dict).map((key, index) =>

      (
        <tr
          key={index} data-cy={`status-${name}-${this.toSnakeCase(key)}`}

        >
          <td style={{
            paddingRight: "1em",
          }}><b>{key}: </b></td>
          <td>{dict[key]}</td>
        </tr>
      )
    );
  }

  renderTable(title, dict = {}) {
    return (
      <table style={{
        fontSize: "14px",
        marginBottom: "1.2em",
      }}>
        <thead>
          <td
            colSpan={2}
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              paddingBottom: "0.8em",
            }}>
            {title}
          </td>
        </thead>
        <tbody>
          {this.buildElements(title, dict)}
        </tbody>
      </table>
    );
  }

  public render() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const feStatusJson = require("../../data/buildInfo.json");
    return (
      <div style={{ padding: "10px", backgroundColor: "white", lineHeight: 1.2 }}>
        { this.renderTable("Frontend", feStatusJson)}
        { this.renderTable("Backend", this.state.backend)}
        { this.renderTable("Remote JS Validators", this.state.remoteJS)}
        { this.renderTable("Background Worker Service", this.state.bgWorker)}
      </div>
    );
  }
}

export default StatusPresenter;
