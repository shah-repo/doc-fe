import React, { useMemo } from "react";
import { DataProps } from "../../../state/ducks/common/types";
import { DocumentRevisionStatus, Reference as Model } from "../../../state/ducks/documentRevisions/types";
import { getReferenceToSummary } from "../utils/references.helpers";
import { ReferenceSummary } from "../utils/types";
import ReferencePresenter from "./reference.presenter";

interface OwnProps {
  status: DocumentRevisionStatus;
  deprecatedAt?: string;
}

export type Props = OwnProps & DataProps<Model[]>;

export const ReferenceToContainer: React.FunctionComponent<Props> = ({
  dataProp,
  status,
  deprecatedAt = "",
}) => {
  const refSummary: ReferenceSummary[] =
    useMemo(() => getReferenceToSummary(dataProp, status, deprecatedAt), [dataProp, status, deprecatedAt]);

  return (
    <ReferencePresenter label="common.references" dataProp={refSummary} />
  );
};

export default ReferenceToContainer;
