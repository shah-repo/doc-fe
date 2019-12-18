import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useDialog from "../../../../hooks/useDialog";
import Text from "../../../Text";
import WatermarkDownload from "./download";
import WatermarkPresenter from "./presenter";

interface Props {
  newWatermarkRequest: any;
  newWatermarkError: string;
}

export const WatermarkContainer: React.FunctionComponent<Props> = ({
  newWatermarkRequest,
  newWatermarkError,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({});
  const dialog = useDialog();
  const handleClose = () => dialog.close();
  useEffect(() => {
    if (!newWatermarkRequest) {
      return;
    }

    setTitle("common.success");
    setContent({
      translation: "watermark.successfully.requested",
      values: {
        file: newWatermarkRequest.attachment.name,
        type: newWatermarkRequest.attachment.type,
      },
    });
    dialog.open();
  }, [newWatermarkRequest]);
  useEffect(() => {
    if (!newWatermarkError) {
      return;
    }

    setTitle("common.error");
    setContent({ message: newWatermarkError });
    dialog.open();
  }, [newWatermarkError]);

  const renderCloseButton = (newWatermarkError || newWatermarkRequest) && (
    <Button onClick={handleClose} color="primary">
      <Text translation="common.close" />
    </Button>
  );

  return (
    <>
      <WatermarkDownload newWatermarkRequest={newWatermarkRequest} />
      <WatermarkPresenter
        isOpen={dialog.isOpen}
        handleClose={handleClose}
        title={title}
        content={content}
      >
        {renderCloseButton}
      </WatermarkPresenter>
    </>
  );
};

export default WatermarkContainer;
