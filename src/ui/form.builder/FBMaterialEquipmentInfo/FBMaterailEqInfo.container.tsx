import React, { useState } from "react";
import { FBMeqState } from "..";
import { toastError } from "../../components/notifications";
import FB from "../helpers/FB";
import { MaterialAndEquipment, MaterialEqContainerProps } from "./FBMaterailEqInfo.types";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";

const FBMaterialEqInfoContainer: React.FunctionComponent<MaterialEqContainerProps> = ({ documentRevisionId }) => {
  const [materialData, setMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const meqState = FB.useRef(FBMeqState);
  const [isMeqDataReceived, setIsMeqDataReceived] = useState(false);
  const callBack = (data: MaterialAndEquipment, error)  => {
    if (error) {
      toastError(error.message);
      return;
    }
    meqState.setMaterialsEquipment(data);
    setMaterialData(data);
  };
  if (!meqState.materialsEquipment && !isMeqDataReceived) {
    setIsMeqDataReceived(true);
    meqState.getMeqDetail(documentRevisionId, callBack);
  }
  return (
    <FBMaterialInfoPresenter
      materialData={materialData}
    />
  );
};
export default FBMaterialEqInfoContainer;


