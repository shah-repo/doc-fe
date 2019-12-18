import { Button } from "@material-ui/core";
import React from "react";
import Text from "../../../Text";

interface Props {
  handleClose: () => void;
}

export const WatermarkError: React.FunctionComponent<Props> = ({
  handleClose,
}) => {
  return (
    <Button onClick={handleClose} color="primary">
      <Text translation="common.close" />
    </Button>
  );
};

export default WatermarkError;
