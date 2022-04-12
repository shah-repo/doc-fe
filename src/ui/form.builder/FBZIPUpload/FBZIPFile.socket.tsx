import { reaction } from "mobx";
import React, { useCallback } from "react";
import { FB } from "..";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBZIPFileSocket: React.FunctionComponent<{docRevisionId: string}> = ({ docRevisionId }) => {
  const { fileUploadState } = FB.useStores();
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

  const getZIPAttachmentStatus = useCallback(() => {
    fileUploadState?.getZIPStatus(attachmentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMqttSubscription(topic, getZIPAttachmentStatus);

  return null;
};

export default FBZIPFileSocket;
