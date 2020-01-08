import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { attachmentsActions, WatermarkRequest, WatermarkRequestStatus } from "../../../state/ducks/attachments";
import { authSelectors } from "../../../state/ducks/auth";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import { WatermarkResponse } from "./types";

interface Props {
  watermarkId: string;
  addRequestResult: (data: WatermarkResponse) => void;
}

export const WatermarkFooterRequest: React.FunctionComponent<Props> = ({
  watermarkId,
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
  const checkWatermarkRequest = () => {
    async.start(asyncAction, watermarkId, async);
  };
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const iotService = IotService.getInstance();
  useEffect(() => {
    iotService.subscribeToTopic(`${employeeId}/attachment_watermark/${watermarkId}/update`, checkWatermarkRequest);
  }, [iotService.subscribedTopics()]);

  return null;
};

export default WatermarkFooterRequest;
