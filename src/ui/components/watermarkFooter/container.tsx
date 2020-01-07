import React, { useEffect, useState } from "react";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { attachmentsActions, WatermarkRequest } from "../../../state/ducks/attachments";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { TextProps } from "../Text";
import WatermarkFooterPresenter from "./presenter";

interface WatermarkResponse {
  success: boolean;
  message: TextProps;
  data?: WatermarkRequest;
}

export const WatermarkFooterContainer: React.FunctionComponent = () => {
  const [requestResults, addRequestResult] = useState<WatermarkResponse[]>([]);
  const asyncAction = useActionCreator(attachmentsActions.checkWatermarkStatus);
  const async = useAsync<WatermarkRequest>({
    onSuccess: (data) => {
      const watermarkRequest = data!;
      console.log(watermarkRequest);
      addRequestResult([
        ...requestResults,
        {
          success: true,
          message: {
            translation: "watermark.download.ready",
            values: {
              name: watermarkRequest.attachment.name,
              type: watermarkRequest.attachment.type,
            },
          },
          data: watermarkRequest,
        },
      ]);
    },
    onError: (message) => {
      console.log(message);
      addRequestResult([
        ...requestResults,
        {
          success: false,
          message: {
            message,
          },
        },
      ]);
    },
  });
  const checkWatermarkRequest = (msg: string) => {
    const id = JSON.parse(msg).data.id;

    console.log(id);
    async.start(asyncAction, id, async);
  };

  const iotService = IotService.getInstance();
  useEffect(() => {
    iotService.subscribeToTopic(`+/watermark/+/created`, checkWatermarkRequest);
    console.log(iotService.subscribedTopics());
    // checkWatermarkRequest(`{ "data": { "id": "123" }}`);
  }, [iotService.subscribedTopics()]);
  useEffect(() => {
    setTimeout(() => checkWatermarkRequest(`{ "data": { "id": "123" }}`), 2000);
  }, []);

  if (requestResults.length === 0) {
    return null;
  }

  return <WatermarkFooterPresenter />;
};

export default WatermarkFooterContainer;
