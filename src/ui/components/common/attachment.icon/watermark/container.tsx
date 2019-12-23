import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useDialog from "../../../../hooks/useDialog";
import Text from "../../../Text";
import WatermarkDownloader from "./downloader";
import WatermarkPresenter from "./presenter";
import WatermarkRequest from "./request";

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
  const [requestResult, setRequestResult] = useState<any>(null);
  const [requestedWatermarks, setRequestedWatermarks] = useState<any>([]);
  const dialog = useDialog();
  const handleClose = () => dialog.close();
  const addRequestResult = (result: any) => {
    setRequestedWatermarks(requestedWatermarks.filter((request: any) =>
      result.data.id !== requestedWatermarks.id,
    ));
    setRequestResult(result);
  };

  useEffect(() => {
    if (!newWatermarkRequest) {
      return;
    }

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
          <WatermarkRequest
            key={request.id}
            request={request}
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
