import React, { useMemo } from "react";
import { DataProps } from "../../../state/ducks/common";
import {
  Reference as Model, DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import ReferencePresenter from "./reference.presenter";
import { getReferenceToSummary } from "../utils/references.helpers";
import { ReferenceSummary } from "../utils/types";

interface OwnProps {
  status: DocumentRevisionStatus;
  deprecatedAt?: string;
}

type Props = OwnProps & DataProps<Model[]>;

const ReferenceToContainer: React.FunctionComponent<Props> = ({
  dataProp,
  status,
  deprecatedAt = "",
}) => {
  const refSummary: ReferenceSummary[] = useMemo(() => {
    return getReferenceToSummary(dataProp, status, deprecatedAt);
  }, [dataProp]);

  return (
    <ReferencePresenter label="common.references" dataProp={refSummary} />
  );
};

export default ReferenceToContainer;
