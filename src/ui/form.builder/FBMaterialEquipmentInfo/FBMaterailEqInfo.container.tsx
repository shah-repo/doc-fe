import React from "react";
import { FBMeqState } from "..";
import { toastError } from "../../components/notifications";
import FB from "../helpers/FB";
import { MaterialAndEquipment, MaterialEqContainerProps } from "./FBMaterailEqInfo.types";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";

const FBMaterialEqInfoContainer: React.FunctionComponent<MaterialEqContainerProps> = ({ documentRevisionId }) => {
  const meqState = FB.useRef(FBMeqState);

  const callBack = (data: MaterialAndEquipment, error)  => {
    if (error) {
      toastError(error.message);
      return;
    }
    meqState.setMaterialsEquipment(data);
  };

  meqState.getMeqDetail(documentRevisionId, callBack);

  return (
    <FBMaterialInfoPresenter
      materialData={meqState.materialsEquipment ?? { equipment: [], materials: [] }}
    />
  );
};
export default FBMaterialEqInfoContainer;


