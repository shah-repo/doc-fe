import React, { useMemo } from "react";
import { DataProps } from "../../../state/ducks/common";
import {
  DocumentRevisionStatus, Reference as Model,
} from "../../../state/ducks/documentRevisions";
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
  const refSummary: ReferenceSummary[] = useMemo(() => {
    return getReferenceToSummary(dataProp, status, deprecatedAt);
  }, [dataProp]);

  return (
    <ReferencePresenter label="common.references" dataProp={refSummary} />
  );
};

export default ReferenceToContainer;
