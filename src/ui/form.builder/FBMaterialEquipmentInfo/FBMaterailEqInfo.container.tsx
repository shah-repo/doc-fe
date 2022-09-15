import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { FBMaterailEqInfoState } from "..";
import { checkIsDocumentEB } from "../../documentRevision/helpers/checkDocumentGroup";
import FB from "../helpers/FB";
import { MaterialEqContainerProps } from "./FBMaterailEqInfo.types";
import { calculateDataDiff } from "./FBMaterailEqInfo.utils";
import FBMaterialEqInfoPresenter from "./FBMaterialEqInfo.presenter";

const FBMaterialEqInfoContainer: React.FC<MaterialEqContainerProps> = ({
  documentRevision,
  inView,
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const includeDiff = (
    checkIsDocumentEB(documentRevision?.document?.documentType.groupOptions) && Boolean(documentRevision?.parent)
  );

  const itemsState = FB.useRef(FBMaterailEqInfoState);
  const [currentData, parentData, loading] = useObserver(() => ([
    itemsState.currentItems,
    itemsState.parentItems,
    itemsState.loading,
  ]));

  useEffect(() => {
    if (inView && documentRevision) {
      itemsState.fetchCurrentItems(documentRevision.id);
    }
  }, [documentRevision, inView, itemsState]);

  useEffect(() => {
    if (inView && documentRevision?.parent && showDiff && !parentData) {
      itemsState.fetchParentItems(documentRevision.parent?.id);
    }
  }, [documentRevision, inView, itemsState, parentData, showDiff]);

  const data = showDiff && parentData ? calculateDataDiff(currentData, parentData) : currentData;

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
