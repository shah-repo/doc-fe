import React, { useEffect, useState, useRef } from "react";

interface Props {
  newWatermarkRequest: any;
}

export const WatermarkDownload: React.FunctionComponent<Props> = ({
  newWatermarkRequest,
}) => {
  const [requested, setRequested] = useState<any>([]);
  const interval = useRef<any>(null);
  const checkRequests = () => {
    const now = new Date().getTime();
    const validRequests = requested.filter((request) => {
      const timeDiff = now - request.timeWhenAdded;
      // valid if less than 2 minutes elapsed
      return timeDiff < 120000;
    });
    validRequests.forEach((request) => {
      console.log(request);
    });
  };
  useEffect(() => {
    if (!newWatermarkRequest) {
      return;
    }
    setRequested([
      ...requested,
      {
        newWatermarkRequest,
        timeWhenAdded: new Date().getTime(),
      },
    ]);
  }, [newWatermarkRequest]);
  useEffect(() => {
    if (requested.length === 0) {
      clearInterval(interval.current);
      return;
    }

    clearInterval(interval.current);

    interval.current = setInterval(() => {
      checkRequests();
    }, 5000);
  }, [requested]);

  return null;
};

export default WatermarkDownload;
