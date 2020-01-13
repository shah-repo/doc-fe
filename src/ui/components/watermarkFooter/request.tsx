import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { attachmentsActions, WatermarkRequest, WatermarkRequestStatus, WatermarkState } from "../../../state/ducks/attachments";
import { authSelectors } from "../../../state/ducks/auth";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import { WatermarkResponse } from "./types";

interface Props {
  addRequestResult: (data: WatermarkResponse) => void;
  watermarkIds: WatermarkState;
}

export const WatermarkFooterRequest: React.FunctionComponent<Props> = ({
  watermarkIds,
  addRequestResult,
}) => {
  const asyncAction = useActionCreator(attachmentsActions.checkWatermarkStatus);
  const async = useAsync<WatermarkRequest>({
    onSuccess: (data) => {
      const watermarkRequest = data!;
      let isSuccess = false;
      let translation = "watermark.request.failed";

      if (watermarkRequest.status === WatermarkRequestStatus.Done) {
        isSuccess = true;
        translation = "watermark.download.ready";
      }

      addRequestResult(
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
      );
    },
  });
  const checkWatermarkRequest = (msg: string) => {
    // NOTE: I couldn't the function to take the correct scope.
    // It was always using the ID of the file that's been requested first
    // We'll have to check if BE can send the correct values in the message
    const id = (msg.split("Attachment watermark ")[1].split(" ")[0]);
    async.start(asyncAction, id, async);
  };
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const iotService = IotService.getInstance();
  useEffect(() => {
    watermarkIds.forEach((watermarkId) => {
      iotService.subscribeToTopic(`${employeeId}/attachment_watermark/${watermarkId}/update`, checkWatermarkRequest);
    });
  }, [iotService.subscribedTopics()]);

  return null;
};

export default WatermarkFooterRequest;
