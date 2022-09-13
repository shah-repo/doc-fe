import { find, isEqual, keys, omit, union, unionWith } from "lodash";
import { useObserver } from "mobx-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FBMeqState } from "..";
import { checkIsDocumentEB } from "../../documentRevision/helpers/checkDocumentGroup";
import FB from "../helpers/FB";
import { FBMEQItemStatus, MaterialAndEquipment, MaterialEqContainerProps, MaterialItem } from "./FBMaterailEqInfo.types";
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
  ) => setter;

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
    childItem: MaterialItem | undefined,
    parentItem: MaterialItem | undefined
  ): FBMEQItemStatus => {
    if (isEqual(childItem, parentItem)) {
      return FBMEQItemStatus.None;
    }
    if (childItem && parentItem) {
      return FBMEQItemStatus.Updated;
    }
    if (childItem) {
      return FBMEQItemStatus.Added;
    }
    return FBMEQItemStatus.Removed;
  };

  const normalizeItem = (item: MaterialItem) => omit(item, ["quantity", "unit"]);

  const calculateSectionDiff = <K extends (MaterialItem)[]>(childItems: K, parentItems: K): K => {
    const allItems = unionWith(
      childItems,
      parentItems,
      (value, other) => isEqual(normalizeItem(value), normalizeItem(other))
    );

    return allItems.map((item) => {
      const childItem = find(childItems, normalizeItem(item));
      const parentItem = find(parentItems, normalizeItem(item));

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

  const data = showDiff ? calculateDataDiff(currentData, parentMaterialData) : currentData;

  return (
    <FBMaterialEqInfoPresenter
      {...{
        data,
        showDiff,
        includeDiff,
        loading,
      }}
      handleShowDiffChange={setShowDiff}
    />
  );
};
export default FBMaterialEqInfoContainer;
