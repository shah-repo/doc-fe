import { find, isEqual, keys, omit, union, unionWith } from "lodash";
import { useObserver } from "mobx-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FBMeqState } from "..";
import { checkIsDocumentEB } from "../../documentRevision/helpers/checkDocumentGroup";
import FB from "../helpers/FB";
import { Equipment, FBMEQItemStatus, Material, MaterialAndEquipment, MaterialEqContainerProps } from "./FBMaterailEqInfo.types";
import FBMaterialEqInfoPresenter from "./FBMaterialEqInfo.presenter";

const FBMaterialEqInfoContainer: React.FunctionComponent<MaterialEqContainerProps> = ({
  documentRevision,
  inView,
}) => {
  const meqState = FB.useRef(FBMeqState);
  const loading = useObserver(() => meqState.loading);
  const [showDiff, setShowDiff] = useState(false);
  const [currentData, setCurrentData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const [parentMaterialData, setParentMaterialData] = useState<MaterialAndEquipment>({ equipment: [], materials: [] });
  const includeDiff = (
    checkIsDocumentEB(documentRevision?.document?.documentType.groupOptions) && Boolean(documentRevision?.parent)
  );

  const callBack = (
    setter: Dispatch<SetStateAction<MaterialAndEquipment>>
  ) => (data: MaterialAndEquipment) => {
    setter(data);
  };

  useEffect(() => {
    if (inView) {
      meqState.getMeqDetail(documentRevision?.id, callBack(setCurrentData));
    }
  }, [meqState, inView, documentRevision]);

  useEffect(() => {
    if (inView && showDiff) {
      meqState.getMeqDetail(documentRevision?.parent?.id, callBack(setParentMaterialData));
    }
  }, [showDiff, meqState, inView, documentRevision]);

  const getItemStatus = (
    childItem: Material | Equipment | undefined,
    parentItem: Material | Equipment | undefined
  ): FBMEQItemStatus => {
    if (isEqual(childItem, parentItem)) {
      return FBMEQItemStatus.None;
    } else if (childItem && parentItem) {
      return FBMEQItemStatus.Updated;
    } else if (childItem) {
      return FBMEQItemStatus.Added;
    } else {
      return FBMEQItemStatus.Removed;
    }
  };

  const calculateSectionDiff = <K extends (Material | Equipment)[]>(childItems: K, parentItems: K): K => {
    const allItems = unionWith(
      childItems,
      parentItems,
      (value, other) => isEqual(omit(value, ["quantity", "unit"]), omit(other, ["quantity", "unit"]))
    );

    return allItems.map((item) => {
      const childItem = find(childItems, omit(item, ["quantity", "unit"]));
      const parentItem = find(parentItems, omit(item, ["quantity", "unit"]));

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
      <FBMaterialEqInfoPresenter
        {...{
          materialData,
          showDiff,
          includeDiff,
          loading,
        }}
        handleShowDiffChange={setShowDiff}
      />
    </>
  );
};
export default FBMaterialEqInfoContainer;
