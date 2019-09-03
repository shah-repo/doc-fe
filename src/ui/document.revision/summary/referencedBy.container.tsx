import React, { useMemo } from "react";
import { DataProps } from "../../../state/ducks/common";
import {
  Reference as Model, DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import ReferencePresenterNew from "./reference.presenterNew";
import { getReferencedBySummary } from "../utils/references.helpers";
import { ReferenceSummary } from "../utils/types";

type Props = DataProps<Model[]>;

const ReferencedByContainer: React.FunctionComponent<Props> = ({
  dataProp,
}) => {
  const refSummary: ReferenceSummary[] = useMemo(() => {
    return getReferencedBySummary(dataProp);
  }, [dataProp]);

  return (
    <ReferencePresenterNew label="common.referenced.by" dataProp={refSummary} />
  );
};

export default ReferencedByContainer;
