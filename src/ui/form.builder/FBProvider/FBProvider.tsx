import { Provider } from "mobx-react";
import React from "react";
import { FBProviderProps } from "..";

const FBProvider: React.FunctionComponent<FBProviderProps> = (props) =>
  <Provider {...props} />;

export default FBProvider;
