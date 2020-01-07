import React, { useEffect, useState } from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { attachmentsActions, WatermarkRequest, WatermarkRequestStatus } from "../../../state/ducks/attachments";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import WatermarkFooterPresenter from "./presenter";
import { WatermarkResponse } from "./types";

export const WatermarkFooterContainer: React.FunctionComponent = () => {
  const [requestResults, setRequestResult] = useState<WatermarkResponse[]>([]);
  const asyncAction = useActionCreator(attachmentsActions.checkWatermarkStatus);
  const async = useAsync<WatermarkRequest>({
    onSuccess: (data) => {
      const watermarkRequest = data!;
      let isSuccess = false;
      let translation = "watermark.download.failed";

      if (watermarkRequest.status === WatermarkRequestStatus.Done) {
        isSuccess = true;
        translation = "watermark.download.ready";
      }

      setRequestResult([
        ...requestResults,
        {
          success: isSuccess,
          message: {
            translation: translation as Translation,
            values: {
              name: watermarkRequest.attachment.name,
              type: watermarkRequest.attachment.type,
            },
          },
          data: watermarkRequest,
        },
      ]);
    },
  });
  const checkWatermarkRequest = (msg: string) => {
    const id = JSON.parse(msg).data.id;

    async.start(asyncAction, id, async);
  };
  const closeMessage = () => {
    setRequestResult([
      ...requestResults.slice(1),
    ]);
  };
  const downloadWatermark = () => {
    const file = requestResults[0];
    window.open(file.data.presignedUrl, "_blank");
    closeMessage();
  };

  const iotService = IotService.getInstance();
  useEffect(() => {
    iotService.subscribeToTopic(`+/watermark/+/created`, checkWatermarkRequest);
  }, [iotService.subscribedTopics()]);

  if (requestResults.length === 0) {
    return null;
  }

  return (
    <WatermarkFooterPresenter
      result={requestResults[0]}
      close={closeMessage}
      download={downloadWatermark}
    />
  );
};

export default WatermarkFooterContainer;
