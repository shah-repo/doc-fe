import React from "react";
import Config from "../../config";
import { getRemoteValidatorBundle } from "./../remoteValidators/RemoteValidators";

const API = Config.ApiEndpoint;
const WORKER_API = Config.WorkerApiEndpoint;
const STATUS_QUERY = "/status";
const MICRO_STATUS_QUERY = "/micro/healthcheck";

interface StatusState {
  data: object;
  data1: object;
  data2: object;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StatusProps {}

class StatusPresenter extends React.Component<StatusProps, StatusState> {

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor() {
    super({}, { data: null, data1: null });
  }

  public componentDidMount() {
    fetch(API + STATUS_QUERY)
      .then((res) => res.text())
      .then(
        (result) => {
          const dict = JSON.parse(result);
          // console.log("Dict 2: " + dict);
          this.setState({ data: dict });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        },
      );
    fetch((WORKER_API || API) + MICRO_STATUS_QUERY)
      .then((res) => res.text())
      .then(
        (result) => {
          const dict = JSON.parse(result);
          // console.log("Dict 3: " + dict);
          this.setState({ data1: dict });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        },
      );
    getRemoteValidatorBundle()
      .then(
        (result) => {
          const dict = result?.buildInfo;
          if (dict) {
            this.setState({ data2: dict });
          } else {
            this.setState({ data2: { Status: "You have to be logged in" } });
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        },
      );
  }

  buildElements(dict) {
    return Object.keys(dict).map((key, index) =>
      (
        <tr key={index}>
          <td><b>{key}: </b></td>
          <td>{dict[key]}</td>
        </tr>
      )
    );
  }

  public render() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const feElements = this.buildElements(require("../../data/buildInfo.json"));
    // const beElems
    const beElements = this.buildElements(this.state?.data || {});
    const beWorkerElements = this.buildElements(this.state?.data1 || {});
    const remoteJsElements = this.buildElements(this.state?.data2 || {});
    return (
      <div style={{ padding: "10px", backgroundColor: "white" }}>
        <h1>Build Info [Frontend]</h1>
        <table style={{ fontSize: "20px" }}>
          <tbody>
            {feElements}
          </tbody>
        </table>
        <br/>
        <h1>Build Info [Backend]</h1>
        <table style={{ fontSize: "20px" }}>
          <tbody>
            { beElements }
          </tbody>
        </table>
        <br/>
        <h1>Remote JS Validators</h1>
        <table style={{ fontSize: "20px" }}>
          <tbody>
            { remoteJsElements }
          </tbody>
        </table>
        <br/>
        <h1>Background Worker Service</h1>
        <table style={{ fontSize: "20px" }}>
          <tbody>
            { beWorkerElements }
          </tbody>
        </table>
      </div>
    );
  }
}

export default StatusPresenter;
