import React, { useState } from "react";
import { FBMeqState } from "..";
import FB from "../helpers/FB";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";

interface  MaterialAndEquipment {
  equipment: [];
  materials: [];
}

const FBMaterialEqInfoContainer: React.FunctionComponent<any> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [materialData, setMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const { workspaceState  } = FB.useStores();
  const meqState = FB.useRef(FBMeqState);
  const docRevId = workspaceState?.document?.id;
  const clBack = (data: MaterialAndEquipment, error: any)  => {
    setIsLoading(false);
    meqState.setMaterialsEquipment(data);
    setMaterialData(data);
  };
  if (!meqState.materialsEquipment) {
    meqState.getMeqDetail(docRevId, clBack);
  }
  return (
    <FBMaterialInfoPresenter
      isLoading={isLoading}
      materialData={materialData}
    />
  );
};
export default FBMaterialEqInfoContainer;


