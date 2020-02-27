import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

interface Props {
  crId: string;
}
const ChangeRequestSummarySockets: React.FunctionComponent<Props> = ({
  crId,
}) => {
  const notify = (msg: string) => {
    const message = JSON.parse(msg).data.message;
    toast(message);
  };
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(`+/change_requests/${crId}/updated`, notify);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/change_requests/${crId}/updated`);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default ChangeRequestSummarySockets;
