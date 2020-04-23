import { Provider } from "mobx-react";
import React from "react";
import { FB } from "..";
import FBReceivePOPresenter from "./FBReceivePO.presenter";
import FBReceivePOState from "./FBReceivePO.state";


const FBReceivePOContainer: React.FunctionComponent<any> = ({
  receiveState,
  ...props
}) => {
  receiveState = FB.useRef<FBReceivePOState>(FBReceivePOState);
  return (
    <Provider receiveState={receiveState}>
      <FBReceivePOPresenter {...props} receiveState={receiveState} />
    </Provider>
  );
};

export default FBReceivePOContainer;
