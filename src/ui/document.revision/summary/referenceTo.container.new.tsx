import React, { useMemo } from "react";
import { DataProps } from "../../../state/ducks/common/types";
import { DocumentRevisionStatus, Reference as Model } from "../../../state/ducks/documentRevisions/types";
import { getReferenceToSummary } from "../utils/references.helpers";
import { ReferenceSummary } from "../utils/types";
import ReferencePresenter from "./reference.presenter.new";

interface OwnProps {
  status: DocumentRevisionStatus;
  deprecatedAt?: string;
  canEdit?: boolean;
}

type Props = OwnProps & DataProps<Model[]>;

const ReferenceToContainer: React.FunctionComponent<Props> = ({
  dataProp,
  status,
  deprecatedAt = "",
  canEdit,
}) => {
  const refSummary: ReferenceSummary[] =
    useMemo(() => getReferenceToSummary(dataProp, status, deprecatedAt), [dataProp, status, deprecatedAt]);
  return (
    <ReferencePresenter label="common.references" dataProp={refSummary} canEdit={canEdit} />
  );
};

export default ReferenceToContainer;
