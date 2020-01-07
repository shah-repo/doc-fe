import React from "react";

export const WatermarkFooterPresenter: React.FunctionComponent = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        zIndex: 9999,
        width: "100%",
      }}
    >
      Watermark footer
    </div>
  );
};

export default WatermarkFooterPresenter;
