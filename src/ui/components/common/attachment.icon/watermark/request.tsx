import React, { useEffect, useState, useRef } from "react";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";

interface Props {
  request: any;
  addRequestResult: (arg: any) => void;
}

export const WatermarkRequest: React.FunctionComponent<Props> = ({
  request,
  addRequestResult,
}) => {
  const timer = useRef<any>(null);
  const NUMBER_OF_RETRIES = 3;
  const RETRY_TIME = 5000;
  const [numberOfRetries, setNumberOfRetries] = useState(0);
  const incrementNumberOfRetries = () => setNumberOfRetries(numberOfRetries + 1);
  const asyncAction = useActionCreator(attachmentsActions.downloadWatermarkedFile);
  const async = useAsync({
    onSuccess: (data: any) => {
      if (data!.status === "DONE") {
        clearInterval(timer.current);
        addRequestResult({
          success: true,
          message: {
            message: "Success",
          },
          data: request,
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
        data: request,
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
            message: "Couldn't process",
          },
          data: request,
        });
        return;
      }
      async.start(asyncAction, request.id, async);
    }, RETRY_TIME);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return null;
};

export default WatermarkRequest;
