import React from "react";
import { IotService } from "../../common/utils/iot/mqttClient";
import { changeRequestsActions } from "../../state/ducks/changeRequest";
import { ChangeRequest } from "../../state/ducks/changeRequest/types";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useMqttSubscription from "../hooks/useMqttSubscription";

interface Props {
  changeRequest: ChangeRequest;
}

const ChangeRequestSockets: React.FunctionComponent<Props> = ({
  changeRequest: {
    crId,
    id,
  },
}) => {
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(`+/change_requests/${crId}/updated`, loadData);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/change_requests/${crId}/updated`);
  };
  const loadAction = useActionCreator(changeRequestsActions.load);
  const async = useAsync();
  const loadData = (msg: string) => {
    async.start(loadAction, id);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default ChangeRequestSockets;
