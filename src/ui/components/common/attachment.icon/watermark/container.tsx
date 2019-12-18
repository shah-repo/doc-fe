import React, { useEffect, useState } from "react";
import useDialog from "../../../../hooks/useDialog";
import WatermarkDialog from "./dialog";
import WatermarkError from "./error";

interface Props {
  newWatermarkRequest: any;
  newWatermarkError: string;
}

export const WatermarkContainer: React.FunctionComponent<Props> = ({
  newWatermarkRequest,
  newWatermarkError,
}) => {
  const [title, setTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const dialog = useDialog();
  const handleClose = () => dialog.close();
  useEffect(() => {
    if (newWatermarkError) {
      setTitle("common.success");
      // setContentText(newWatermarkRequest);
      console.log(newWatermarkRequest);
      dialog.open();
    }
  }, [newWatermarkRequest]);
  useEffect(() => {
    if (newWatermarkError) {
      setTitle("common.error");
      setContentText(newWatermarkError);
      dialog.open();
    }
  }, [newWatermarkError]);

  return (
    <WatermarkDialog
      isOpen={dialog.isOpen}
      handleClose={handleClose}
      title={title}
      contentText={contentText}
    >
      {newWatermarkError && <WatermarkError handleClose={handleClose} />}
    </WatermarkDialog>
  );
};

export default WatermarkContainer;
