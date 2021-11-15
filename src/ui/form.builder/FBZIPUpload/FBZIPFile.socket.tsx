import { reaction } from "mobx";
import React from "react";
import { FB } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBZIPFileSocket: React.FunctionComponent<{docRevisionId: string}> = ({ docRevisionId }) => {
  const { fileUploadState } = FB.useStores();
  const iotService = IotService.getInstance();
  let topic: string;
  let attachmentId: string;

  React.useEffect(() => reaction(
    () => fileUploadState?.startAttachmentUnzippingApi.data,
    (data) => {
      attachmentId = data.attachmentId;
      topic = `+/unzipJob/${data.id}/${docRevisionId}/${attachmentId}/finished`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  const subscribe = () => {
    iotService.subscribeToTopic(
      topic, getZIPAttachmentStatus
    );
  };

  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      topic,
    );
  };

  const getZIPAttachmentStatus = () => {
    fileUploadState?.getZIPStatus(attachmentId);
  };

  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBZIPFileSocket;
