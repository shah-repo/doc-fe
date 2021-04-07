import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attachmentsActions, attachmentsSelectors } from "../../../state/ducks/attachments";
import WatermarkFooterPresenter from "./presenter";
import WatermarkFooterRequest from "./request";
import { WatermarkResponse } from "./types";

const WatermarkFooterContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [requestResults, setRequestResult] = useState<WatermarkResponse[]>([]);
  const removeWatermark = (id: string) => dispatch(attachmentsActions.removeWatermark(id));
  const closeMessage = () => {
    setRequestResult([
      ...requestResults.slice(1),
    ]);
  };
  const downloadWatermark = () => {
    const file = requestResults[0];
    window.open(file.data.presignedUrl, "_blank");
    closeMessage();
  };
  const watermarkIds = useSelector(attachmentsSelectors.getWatermarks);
  const addRequestResult = (data) => {
    setRequestResult([
      ...requestResults,
      data,
    ]);
  };

  useEffect(() => () => {
    dispatch(attachmentsActions.clearWatermarks());
  }, [dispatch]);

  const renderFooter = requestResults.length > 0 && (
    <WatermarkFooterPresenter
      result={requestResults[0]}
      close={closeMessage}
      download={downloadWatermark}
    />
  );

  return (
    <>
      {
        watermarkIds.map((watermarkId) => (
          <WatermarkFooterRequest
            key={watermarkId}
            watermarkId={watermarkId}
            addRequestResult={addRequestResult}
            removeWatermark={removeWatermark}
          />
        ))
      }
      {renderFooter}
    </>
  );
};

export default WatermarkFooterContainer;
