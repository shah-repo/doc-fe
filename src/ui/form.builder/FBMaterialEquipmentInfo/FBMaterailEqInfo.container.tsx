import React, { useState } from "react";
import { FBMeqState } from "..";
import FB from "../helpers/FB";
import { MaterialAndEquipment } from "./FBMaterailEqInfo.types";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";

const FBMaterialEqInfoContainer: React.FunctionComponent = () => {
  const [materialData, setMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const { workspaceState  } = FB.useStores();
  const meqState = FB.useRef(FBMeqState);
  const docRevId = workspaceState?.document?.id;
  const callBack = (data: MaterialAndEquipment)  => {
    meqState.setMaterialsEquipment(data);
    setMaterialData(data);
  };
  if (!meqState.materialsEquipment) {
    meqState.getMeqDetail(docRevId, callBack);
  }
  return (
    <FBMaterialInfoPresenter
      materialData={materialData}
    />
  );
};
export default FBMaterialEqInfoContainer;


