import _ from "lodash";
import {
  DocumentRevision,
  DocumentRevisionStatus,
  DocumentRevisionType,
} from "../../../state/ducks/documentRevisions";
import { SelectOption } from "../../components/forms/fields/Select";
import { DocumentRevisionUserProps } from "./types";

const isDraft = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.Draft;

const isPendingChange = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.PendingChange;

export const canEditDocumentRevision = ({ dataProp, currentUserEmail}: DocumentRevisionUserProps) =>
  currentUserEmail === dataProp.owner.email && (isDraft(dataProp) || isPendingChange(dataProp));

export const documentRevisionIdMask = (
  type: string,
  count: string | number,
) => {
    const countStr = "" + count;
    const pad = "0000";
    return type + pad.substring(0, pad.length - countStr.length) + countStr;
};

export const documentRevisionTypeOption = () => {
  const options: SelectOption[] = [];
  Object.keys(DocumentRevisionType).map((key) => options.push({value: key, text: key}));
  return _.orderBy(options, ["text"], ["asc"]);
};

export const documentRevisionStatusOption = () => {
  const options: SelectOption[] = [];
  Object.keys(DocumentRevisionStatus).map((key) => {
    // TODO: Change DocumentRevisionStatus enum into key = value, value = text
    const keyName = DocumentRevisionStatus[key as keyof typeof DocumentRevisionStatus];
    if (keyName !== DocumentRevisionStatus.Deprecated) {
      options.push({value: keyName, text: keyName});
    }
  });
  return _.orderBy(options, ["text"], ["asc"]);
};

export const documentRevisionQueryStatus = (): DocumentRevisionStatus[] =>
  Object.values(DocumentRevisionStatus).filter((value) => value !== DocumentRevisionStatus.Deprecated);

export const documentRevisionTypeFormOption = () => {
  const options: SelectOption[] = [];
  Object.keys(DocumentRevisionType).map((key) => {
    const keyName = DocumentRevisionType[key as keyof typeof DocumentRevisionType];
    options.push({value: key, text: keyName});
  });
  return _.orderBy(options, ["text"], ["asc"]);
};
