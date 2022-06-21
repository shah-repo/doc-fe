import React, { useState } from "react";
import { FBMeqState } from "..";
import FB from "../helpers/FB";
import { MaterialAndEquipment, MaterialEqContainerProps } from "./FBMaterailEqInfo.types";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";

const FBMaterialEqInfoContainer: React.FunctionComponent<MaterialEqContainerProps> = ({ documentRevisionId }) => {
  const [materialData, setMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const meqState = FB.useRef(FBMeqState);
  const callBack = (data: MaterialAndEquipment)  => {
    meqState.setMaterialsEquipment(data);
    setMaterialData(data);
  };
  if (!meqState.materialsEquipment) {
    meqState.getMeqDetail(documentRevisionId, callBack);
  }
  return (
    <FBMaterialInfoPresenter
      materialData={materialData}
    />
  );
};
export default FBMaterialEqInfoContainer;


