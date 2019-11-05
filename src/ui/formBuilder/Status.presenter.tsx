import React from "react";

const StatusPresenter: React.FunctionComponent = () => {
    const dict = require("../../data/buildInfo.json");
    const elements = Object.keys(dict).map((key: string) => {
      return (
        <tr key={key}>
          <td><b>{key}: </b></td>
          <td>{dict[key]}</td>
        </tr>
      );
    });
    return (
      <div style={{padding: "10px"}}>
        <h1>Build Info</h1>
        <table style={{fontSize: "20px"}}>
          {elements}
        </table>
      </div>
    );
  };

export default StatusPresenter;
