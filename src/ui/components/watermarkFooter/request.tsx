/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { attachmentsActions } from "../../../state/ducks/attachments";
import { WatermarkRequest, WatermarkRequestStatus } from "../../../state/ducks/attachments/types";
import { authSelectors } from "../../../state/ducks/auth";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";
import { Translation } from "../../translations/types";
import { WatermarkResponse } from "./types";

interface Props {
  addRequestResult: (data: WatermarkResponse) => void;
  removeWatermark: (id: string) => void;
  watermarkId: string;
}

const WatermarkFooterRequest: React.FunctionComponent<Props> = ({
  watermarkId,
  addRequestResult,
  removeWatermark,
}) => {
  const intl = useIntl();
  const asyncAction = useActionCreator(attachmentsActions.checkWatermarkStatus);
  const async = useAsync<WatermarkRequest>({
    onSuccess: (watermarkRequest = {} as WatermarkRequest) => {
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
              fileType: watermarkRequest.hasWatermarks ? intl.formatMessage({
                id: "watermark.file",
              }) : intl.formatMessage({
                id: "pdf.file",
              }),
              name: watermarkRequest.attachment.name,
              type: watermarkRequest.attachment.type,
            },
          },
          data: watermarkRequest,
        },
      );
      removeWatermark(watermarkRequest.id);
      iotService.unsubscribeFromTopic(`${employeeId}/attachment_watermark/${watermarkRequest.id}/update`);
    },
    onError: (msg) => {
      addRequestResult(
        {
          success: false,
          message: {
            translation: msg as Translation,
          },
          data: {} as WatermarkRequest,
        },
      );
    },
  });
  const checkWatermarkRequest = (msg: string) => {
    async.start(asyncAction, watermarkId, async);
  };
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(`${employeeId}/attachment_watermark/${watermarkId}/update`, checkWatermarkRequest);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`${employeeId}/attachment_watermark/${watermarkId}/update`);
  };

  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default WatermarkFooterRequest;
