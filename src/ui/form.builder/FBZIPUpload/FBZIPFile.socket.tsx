import { reaction } from "mobx";
import React from "react";
import { FB } from "..";
import { IotService } from "../../../common/utils/iot/iotService";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBZIPFileSocket: React.FunctionComponent<{docRevisionId: string}> = ({ docRevisionId }) => {
  const { fileUploadState } = FB.useStores();
  const iotService = IotService.getInstance();
  const [topic, setTopic] = React.useState("");
  const [attachmentId, setAttachmentId] = React.useState("");

  React.useEffect(() => reaction(
    () => fileUploadState?.startAttachmentUnzippingApi.data,
    (data) => {
      if (!data) {
        return;
      }
      setAttachmentId(data.attachmentId);
      setTopic(`+/unzipJob/${data.id}/${docRevisionId}/${data.attachmentId}/finished`);
      fileUploadState?.setUnzipStatus(data.status);
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
