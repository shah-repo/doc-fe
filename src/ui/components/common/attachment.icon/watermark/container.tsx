import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { attachmentsActions, WatermarkRequest } from "../../../../../state/ducks/attachments";
import { Nullable } from "../../../../../state/ducks/common";
import useDialog from "../../../../hooks/useDialog";
import Text from "../../../Text";
import { WatermarkResponse } from "../utils/types";
import WatermarkDownloader from "./downloader";
import WatermarkPresenter from "./presenter";
import WatermarkRequestContainer from "./request";

interface Props {
  newWatermarkRequest: Nullable<WatermarkRequest>;
  newWatermarkError: string;
}

export const WatermarkContainer: React.FunctionComponent<Props> = ({
  newWatermarkRequest,
  newWatermarkError,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({});
  const [requestResult, setRequestResult] = useState<Nullable<WatermarkResponse>>(null);
  const [requestedWatermarks, setRequestedWatermarks] = useState<WatermarkRequest[]>([]);
  const dialog = useDialog();
  const handleClose = () => dialog.close();
  const addRequestResult = (result: WatermarkResponse) => {
    setRequestedWatermarks(requestedWatermarks.filter((request) =>
      result.data.id !== request.id,
    ));
    setRequestResult(result);
  };
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
      {requestedWatermarks.map((request) => {
        return (
          <WatermarkRequestContainer
            key={request.id}
            requestedFile={request}
            addRequestResult={addRequestResult}
          />
        );
      })}
      <WatermarkDownloader
        isMainDialogOpen={dialog.isOpen}
        request={requestResult}
      />
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
