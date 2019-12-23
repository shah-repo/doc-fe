import React, { useEffect, useRef, useState } from "react";
import { attachmentsActions, WatermarkRequest, WatermarkRequestStatus } from "../../../../../state/ducks/attachments";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import { WatermarkResponse } from "../utils/types";

interface Props {
  requestedFile: WatermarkRequest;
  addRequestResult: (arg: WatermarkResponse) => void;
}

export const WatermarkRequestContainer: React.FunctionComponent<Props> = ({
  requestedFile,
  addRequestResult,
}) => {
  const timer = useRef<any>(null);
  const NUMBER_OF_RETRIES = 3;
  const RETRY_TIME = 5000;
  const [numberOfRetries, setNumberOfRetries] = useState(0);
  const incrementNumberOfRetries = () => setNumberOfRetries(numberOfRetries + 1);
  const asyncAction = useActionCreator(attachmentsActions.checkWatermarkStatus);
  const async = useAsync({
    onSuccess: (data: WatermarkRequest = {} as WatermarkRequest) => {
      if (data!.status === WatermarkRequestStatus.Done) {
        clearInterval(timer.current);
        addRequestResult({
          success: true,
          message: {
            translation: "watermark.downlaod.ready",
            values: {
              name: data.attachment.name,
              type: data.attachment.type,
            },
          },
          data,
        });
      }
    },
    onError: (message) => {
      clearInterval(timer.current);
      addRequestResult({
        success: false,
        message: {
          message,
        },
        data: requestedFile,
      });
    },
  });
  useEffect(() => {
    timer.current = setInterval(() => {
      incrementNumberOfRetries();
      if (numberOfRetries > NUMBER_OF_RETRIES) {
        clearInterval(timer.current);
        addRequestResult({
          success: false,
          message: {
            message: "watermark.request.failed",
            values: {
              name: requestedFile.attachment.name,
              type: requestedFile.attachment.type,
            },
          },
          data: requestedFile,
        });
        return;
      }
      async.start(asyncAction, requestedFile.id, async);
    }, RETRY_TIME);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return null;
};

export default WatermarkRequestContainer;
