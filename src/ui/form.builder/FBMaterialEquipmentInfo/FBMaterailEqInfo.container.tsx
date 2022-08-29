import React, { useEffect, useState } from "react";
import { FB } from "..";
import { toastError } from "../../components/notifications";
import { MaterialAndEquipment, MaterialEqContainerProps } from "./FBMaterailEqInfo.types";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";
import FBMeqState from "./FBMeq.state";

const FBMaterialEqInfoContainer: React.FunctionComponent<MaterialEqContainerProps> =
  ({ documentRevisionId, inView }) => {
    const meqState = FB.useRef(FBMeqState);
    const [materialData, setMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });

    const callBack = (data: MaterialAndEquipment, error)  => {
      if (error) {
        toastError(error.message);
        return;
      }
      setMaterialData(data);
    };

    useEffect(() => {
      if (inView) {
        meqState.getMeqDetail(documentRevisionId, callBack);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <FBMaterialInfoPresenter
        materialData={materialData}
      />
    );
  };
export default FBMaterialEqInfoContainer;


