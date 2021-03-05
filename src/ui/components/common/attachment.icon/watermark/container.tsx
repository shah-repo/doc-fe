/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { WatermarkRequest } from "../../../../../state/ducks/attachments/types";
import { Nullable } from "../../../../../state/ducks/common/types";
import useDialog from "../../../../hooks/useDialog";
import Text from "../../../Text";
import WatermarkPresenter from "./presenter";

interface Props {
  newWatermarkRequest: Nullable<WatermarkRequest>;
  newWatermarkError: string;
}

const WatermarkContainer: React.FunctionComponent<Props> = ({
  newWatermarkRequest,
  newWatermarkError,
}) => {
  const intl = useIntl();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({});
  const [requestedWatermarks, setRequestedWatermarks] = useState<WatermarkRequest[]>([]);
  const dialog = useDialog();
  const handleClose = () => dialog.close();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!newWatermarkRequest) {
      return;
    }

    dispatch(attachmentsActions.addWatermark(newWatermarkRequest.id));
    setRequestedWatermarks([...requestedWatermarks, newWatermarkRequest]);
    setTitle("common.success");
    setContent({
      translation: "watermark.successfully.requested",
      values: {
        fileType: newWatermarkRequest.hasWatermarks ? intl.formatMessage({
          id: "watermark.file",
        }) : intl.formatMessage({
          id: "pdf.file",
        }),
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
    <WatermarkPresenter
      isOpen={dialog.isOpen}
      handleClose={handleClose}
      title={title}
      content={content}
    >
      {renderCloseButton}
    </WatermarkPresenter>
  );
};

export default WatermarkContainer;
