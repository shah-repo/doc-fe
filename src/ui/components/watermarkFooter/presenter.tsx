import { Button } from "@material-ui/core";
import React from "react";
import Text from "../Text";
import { WatermarkResponse } from "./types";

interface Props {
  result: WatermarkResponse;
  close: () => void;
  download: () => void;
}

export const WatermarkFooterPresenter: React.FunctionComponent<Props> = ({
  result,
  close,
  download,
}) => {
  const renderDownload = result.success && (
    <Button
      color="primary"
      onClick={download}
    >
      <Text translation="common.download" />
    </Button>
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        zIndex: 9999,
        width: "100%",
        backgroundColor: "white",
        padding: 10,
        textAlign: "right",
      }}
    >
      <Text {...result.message} />
      {renderDownload}
      <Button
        color="primary"
        onClick={close}
      >
        <Text translation="common.cancel" />
      </Button>
    </div>
  );
};

export default WatermarkFooterPresenter;
