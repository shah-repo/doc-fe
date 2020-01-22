import React, { useEffect } from "react";
import { IotService } from "../../common/utils/iot/mqttClient";
import { dashboardActions } from "../../state/ducks/dashboard";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useDidMqttConnect from "../hooks/useDidMqttConnect";

interface Props {
  changeRequestId: string;
}

const ChangeRequestSockets: React.FunctionComponent<Props> = ({
  changeRequestId,
}) => {
  const didMqttConnect = useDidMqttConnect();
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(`+/change_requests/${changeRequestId}/updated`, loadData);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/change_requests/${changeRequestId}/updated`);
  };
  const loadAction = useActionCreator(dashboardActions.loadPendingActionsList);
  const async = useAsync();
  const loadData = (msg: string) => {
    console.log("LOAD");
    async.start(loadAction);
  };
  useEffect(() => {
    subscribe();
    return () => {
      // component will unsubscribe on unmount, no need for unsubscribeAll
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    subscribe();
  }, [didMqttConnect]);

  return null;
};

export default ChangeRequestSockets;
