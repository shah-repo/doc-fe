import { Provider } from "mobx-react";
import React from "react";
import { SMProviderProps } from "../../..";

const SMProvider: React.FunctionComponent<SMProviderProps> = (props) =>
  <Provider {...props} />;

export default SMProvider;
