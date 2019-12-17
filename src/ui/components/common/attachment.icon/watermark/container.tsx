import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import WatermarkNotification from "./notification";

interface Props {
  newWatermarkRequest: any;
  newWatermarkError: string;
}

export const WatermarkContainer: React.FunctionComponent<Props> = ({
  newWatermarkRequest,
  newWatermarkError,
}) => {
  useEffect(() => {

  }, [newWatermarkRequest]);
  useEffect(() => {

  }, [newWatermarkError]);

  return (
    <Box>
      <WatermarkNotification />
    </Box>
  );
};

export default WatermarkContainer;
