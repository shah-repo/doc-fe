import React, { useState } from "react";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";


const FBMaterialEqInfoContainer: React.FunctionComponent<any> = ({ documentRevisionId }) => {
  const [isLoading] = useState(false);
  return (
    <FBMaterialInfoPresenter
      isLoading={isLoading}
    />
  );
};

export default FBMaterialEqInfoContainer;
