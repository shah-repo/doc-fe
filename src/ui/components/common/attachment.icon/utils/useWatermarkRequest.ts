
import { useEffect, useState } from "react";
import WatermarkRequest from "./WatermarkRequest";

const useWatermarkRequest = (setRequestResults: any) => {
  const [watermarkRequest] = useState(new WatermarkRequest(setRequestResults));

  useEffect(() => () => {
    watermarkRequest.disconnect(); // disconnect on unmount
  }, []);

  return watermarkRequest;
};

export default useWatermarkRequest;
