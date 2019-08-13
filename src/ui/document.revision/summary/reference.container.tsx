import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { Reference as Model, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { documentVersionPath, documentDetailsPath, documentDetailsPathWithDeprecatedDate } from "../utils/paths";
import ReferencePresenter from "./reference.presenter";

interface OwnProps {
  isReferenceTo: boolean;
  status?: DocumentRevisionStatus;
  deprecatedAt?: string;
}

type Props = OwnProps & DataProps<Model[]>;

const ReferenceContainer: React.FunctionComponent<Props> = ({
  isReferenceTo,
  dataProp,
  status,
  deprecatedAt = "",
}) => {
  let getUrl;
  let label;

  if (isReferenceTo) {
    label = "common.references";
    getUrl = status === DocumentRevisionStatus.Deprecated
      ? (reference: any) => documentDetailsPathWithDeprecatedDate(reference.id, deprecatedAt)
      : (reference: any) => documentDetailsPath(reference.id);
  } else {
    label = "common.referenced.by";
    getUrl = (reference: any) => documentVersionPath(reference.id, reference.document.id);
  }

  return (
    <ReferencePresenter label={label} getUrl={getUrl} dataProp={dataProp} />
  );
};

export default ReferenceContainer;
