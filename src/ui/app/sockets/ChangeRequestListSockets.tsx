import React from "react";
import { useDispatch } from "react-redux";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { CR_TABLE_NAME } from "../../change.request/list/container";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const ChangeRequestListSockets: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic("+/change_requests/+crId/created", loadData);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic("+/change_requests/+crId/created");
  };
  const loadData = (msg: string, params: any) => {
    dispatch(
      tableSearchActions.setForceUpdate(
        CR_TABLE_NAME,
        true,
      ),
    );
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default ChangeRequestListSockets;
