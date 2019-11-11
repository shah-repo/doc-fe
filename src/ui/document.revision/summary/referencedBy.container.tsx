import React, { useMemo } from "react";
import { DataProps } from "../../../state/ducks/common";
import {
  Reference as Model,
} from "../../../state/ducks/documentRevisions";
import { getReferencedBySummary } from "../utils/references.helpers";
import { ReferenceSummary } from "../utils/types";
import ReferencePresenter from "./reference.presenter";

export type Props = DataProps<Model[]>;

export const ReferencedByContainer: React.FunctionComponent<Props> = ({
  dataProp,
}) => {
  const refSummary: ReferenceSummary[] = useMemo(() => {
    return getReferencedBySummary(dataProp);
  }, [dataProp]);

  return (
    <ReferencePresenter label="common.referenced.by" dataProp={refSummary} />
  );
};

export default ReferencedByContainer;
