import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { Reference as Model, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { documentVersionPath, documentDetailsPath, documentDetailsPathWithDeprecatedDate } from "../utils/paths";
import ReferencePresenter from "./reference.presenter";

const _ = require("lodash");

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
  let docId;
  let docTitle;

  if (isReferenceTo) {
    label = "common.references";
    getUrl = status === DocumentRevisionStatus.Deprecated
      ? (reference: any) => documentDetailsPathWithDeprecatedDate(reference.id, deprecatedAt)
      : (reference: any) => documentDetailsPath(reference.id);
    docId = (reference: any) => reference.docId;
    docTitle = (reference: any) => reference.documentRevisions && _.last(reference.documentRevisions).name;
  } else {
    label = "common.referenced.by";
    getUrl = (reference: any) => documentVersionPath(reference.id, reference.document.id);
    docId = (reference: any) => reference.document.docId;
    docTitle = (reference: any) => reference.name;

  }

  return (
    <ReferencePresenter label={label} getUrl={getUrl} dataProp={dataProp} docId={docId} docTitle={docTitle}/>
  );
};

export default ReferenceContainer;
