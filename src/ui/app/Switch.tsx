import React from "react";
import { Redirect, Switch as ReactSwitch } from "react-router-dom";
import { HOME_URL } from "../constants/urls";

const Switch: React.FunctionComponent = ({ children }) => {
  return (
    <ReactSwitch>
      {children}
      <Redirect to={{ pathname: HOME_URL }} />
    </ReactSwitch>
  );
};

export default Switch;
