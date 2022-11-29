import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { FBMaterailEqInfoState } from "..";
import { checkIsDocumentEB, checkIsDocumentForm, checkIsDocumentLHRT, checkIsDocumentMPI } from "../../documentRevision/helpers/checkDocumentGroup";
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

  const isObsolete = Boolean(documentRevision?.displayStatus.includes("Obsolete"));
  const isLHRT = checkIsDocumentLHRT(documentRevision?.document?.documentType?.groupOptions);
  const isMPI = checkIsDocumentMPI(documentRevision?.document?.documentType?.groupOptions);
  const isForm = checkIsDocumentForm(documentRevision?.document?.documentType?.groupOptions);
  const shouldFetch = !isForm || isLHRT || isMPI;

  useEffect(() => {
    if (inView && shouldFetch && documentRevision) {
      itemsState.fetchCurrentItems(documentRevision.id);
    }
  }, [documentRevision, inView, itemsState, shouldFetch]);

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
        isObsolete,
      }}
      handleShowDiffChange={setShowDiff}
    />
  );
};
export default FBMaterialEqInfoContainer;
