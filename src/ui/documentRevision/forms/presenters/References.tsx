import React, { useMemo } from "react";
import { DocumentRevisionDocument } from "../../../../state/ducks/documentRevisions";
import ReferencePresenter from "../../../document.revision/summary/reference.presenter";
import { getReferencedBySummary } from "../../../document.revision/utils/references.helpers";

export interface Props {
  document?: Partial<DocumentRevisionDocument>;
}

export const References: React.FunctionComponent<Props> = ({
  document,
}) => {
  const refSummary = useMemo(() => getReferencedBySummary(document?.referencedBy || []), [document]);

  if (document?.referencedBy?.length === 0) {
    return null;
  }

  return (
    <div style={{ marginLeft: -15 }}>
      <ReferencePresenter dataProp={refSummary} label="common.referenced.by" />
    </div>
  );
};

export default References;
