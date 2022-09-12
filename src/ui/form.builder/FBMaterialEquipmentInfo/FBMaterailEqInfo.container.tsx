import { isEqual, keys, union, unionBy } from "lodash";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FBMeqState, FBPartItemStatus } from "..";
import { toastError } from "../../components/notifications";
import { checkIsDocumentEB } from "../../documentRevision/helpers/checkDocumentGroup";
import FB from "../helpers/FB";
import { Equipment, Material, MaterialAndEquipment, MaterialEqContainerProps } from "./FBMaterailEqInfo.types";
import FBMaterialInfoPresenter from "./FBMaterialEqInfo.presenter";
import FBMaterialEqInfoPresenterNext from "./FBMaterialEqInfo.presenter.next";

const FBMaterialEqInfoContainer: React.FunctionComponent<MaterialEqContainerProps> = ({
  documentRevision,
  inView,
}) => {
  const meqState = FB.useRef(FBMeqState);
  const [showDiff, setShowDiff] = useState(false);
  const [currentData, setCurrentData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const [parentMaterialData, setParentMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const includeDiff = (
    checkIsDocumentEB(documentRevision?.document?.documentType.groupOptions)
    && Boolean(documentRevision?.parent)
  );

  const callBack = (
    setter: Dispatch<SetStateAction<MaterialAndEquipment>>
  ) => (data: MaterialAndEquipment, error: Error)  => {
    if (error) {
      toastError(error.message);
      return;
    }
    setter(data);
  };

  useEffect(() => {
    if (inView) {
      meqState.getMeqDetail(documentRevision?.id, callBack(setCurrentData));
    }
  }, [meqState, inView, documentRevision]);

  useEffect(() => {
    if (inView) {
      meqState.getMeqDetail(documentRevision?.parent?.id, callBack(setParentMaterialData));
    }
  }, [showDiff, includeDiff, meqState, inView, documentRevision]);


  const getItemStatus = (
    childItem: Material | Equipment | undefined,
    parentItem: Material | Equipment | undefined
  ): FBPartItemStatus => {
    if (isEqual(childItem, parentItem)) {
      return "none";
    } else if (childItem && parentItem) {
      return "updated";
    } else if (childItem) {
      return "added";
    } else {
      return "removed";
    }
  };

  const calculateSectionDiff = <K extends (Material | Equipment)[]>(childItems: K, parentItems: K): K => {
    const allItems = unionBy(childItems, parentItems, (compare) => [compare.docId, compare.title].join());

    return allItems.map((item) => {
      const childItem = childItems.find((el) => el.docId === item.docId && el.title === item.title);
      const parentItem = parentItems.find((el) => el.docId === item.docId && el.title === item.title);

      return {
        ...item,
        status: getItemStatus(childItem, parentItem),
      };
    }) as K;
  };

  const calculateDataDiff = <T extends MaterialAndEquipment>(child: T, parent: T): T => {
    const allKeys = union(keys(child), keys(parent));

    return allKeys.reduce((acc, key) => ({
      ...acc,
      [key]: calculateSectionDiff(child[key], parent[key]),
    }), {}) as T;
  };

  const materialData = showDiff ? calculateDataDiff(currentData, parentMaterialData) : currentData;

  return (
    <>
      <FBMaterialEqInfoPresenterNext
        {...{
          materialData,
          showDiff,
          includeDiff,
        }}
        handleShowDiffChange={setShowDiff}
      />
      <FBMaterialInfoPresenter
        {...{
          materialData,
          showDiff,
          includeDiff,
        }}
        handleShowDiffChange={setShowDiff}
      />
    </>
  );
};
export default FBMaterialEqInfoContainer;


