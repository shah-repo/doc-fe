import React, { useState } from "react";
import { useSelector } from "react-redux";
import { attachmentsSelectors } from "../../../state/ducks/attachments";
import WatermarkFooterPresenter from "./presenter";
import WatermarkFooterRequest from "./request";
import { WatermarkResponse } from "./types";

export const WatermarkFooterContainer: React.FunctionComponent = () => {
  const [requestResults, setRequestResult] = useState<WatermarkResponse[]>([]);
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
  const watermarks = useSelector(attachmentsSelectors.getWatermarks);
  const addRequestResult = (data) => {
    setRequestResult([
      ...requestResults,
      data,
    ]);
  };

  const renderFooter = requestResults.length > 0 && (
    <WatermarkFooterPresenter
      result={requestResults[0]}
      close={closeMessage}
      download={downloadWatermark}
    />
  );
  const renderRequest = watermarks.map((watermarkId) => {
    return (
      <WatermarkFooterRequest
        key={watermarkId}
        watermarkId={watermarkId}
        addRequestResult={addRequestResult}
      />
    );
  });

  return (
    <>
      {renderRequest}
      {renderFooter}
    </>
  );
};

export default WatermarkFooterContainer;
