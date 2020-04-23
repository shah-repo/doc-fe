import { Provider } from "mobx-react";
import React, { useEffect } from "react";
import { FB } from "..";
import FBReceivePOPresenter from "./FBReceivePO.presenter";
import FBReceivePOState from "./FBReceivePO.state";


const FBReceivePOContainer: React.FunctionComponent<any> = ({
  receiveState,
  ...props
}) => {
  receiveState = FB.useRef<FBReceivePOState>(FBReceivePOState);
  useEffect(() => {
    receiveState.name = props.name;
    receiveState.initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.name]);
  return (
    <Provider receiveState={receiveState}>
      <FBReceivePOPresenter {...props} receiveState={receiveState} />
    </Provider>
  );
};

export default FBReceivePOContainer;
