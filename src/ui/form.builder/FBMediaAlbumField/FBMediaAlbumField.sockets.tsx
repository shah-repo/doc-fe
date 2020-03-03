import React from "react";
import { FB, FBMediaProps } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBMediaAlbumFieldSockets: React.FunctionComponent = () => {
  const { mediaAlbumFieldUpload } = FB.useStores();
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(
      "+/document/+/file_uploaded",
      notify
    );
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      "+/document/+/file_uploaded",
      // `+/document/${FBStore.documentId}/file_uploaded`
    );
  };
  const notify = (msg: FBMediaProps) => {
    mediaAlbumFieldUpload?.downloadCandidates();
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBMediaAlbumFieldSockets;
