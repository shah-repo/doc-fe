import React, { useState } from "react";
import { FBMeqState } from "..";
import FB from "../helpers/FB";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";

interface LotItem {
  lotId: string;
  partId: string;
  quantity: number;
  unit: string;
}
interface Material {
  docId: string;
  title: string;
  revision: string;
  quantity: number;
  unit: string;
  lots: LotItem[];
}
interface Equipment {
  docId: string;
  title: string;
  nextCalibration: Date;
  nextPm: Date;
  lots: LotItem[];
}
interface  MaterialAndEquipment {
  equipment: Equipment[];
  materials:  Material [];
}

const FBMaterialEqInfoContainer: React.FunctionComponent<any> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [materialData, setMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const { workspaceState  } = FB.useStores();
  const meqState = FB.useRef(FBMeqState);
  const docRevId = workspaceState?.document?.id;
  const clBack = (data: any, error: any)  => {
    meqState.setMaterialsEquipment(data);
    setIsLoading(false);
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


