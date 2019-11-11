import _ from "lodash";
import moment from "moment-timezone";
import {
  DocumentRevision,
  DocumentRevisionStatus,
  DocumentRevisionType,
} from "../../../state/ducks/documentRevisions";
import { store } from "../../../state/store";
import { SelectOption } from "../../components/forms/fields/Select";
import { ReleasedDateOptions } from "./types";

const isDraft = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.Draft;

const isPendingChange = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.PendingChange;

export const canEditDocumentRevision = (documentRevision: DocumentRevision) => {
  const owner = _.get(documentRevision, "owner.email");
  const currentUser = store.getState().auth.user.email;
  return (
    currentUser === owner &&
    (isDraft(documentRevision) || isPendingChange(documentRevision))
  );
};

export const documentRevisionIdMask = (
  type: string,
  count: string | number,
) => {
    const countStr = "" + count;
    const pad = "0000";
    return type + pad.substring(0, pad.length - countStr.length) + countStr;
};

// TODO: check if we still need this
// ENC-807 document types are fetched from BE
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

// TODO: check if we still need this
// ENC-807 document types are fetched from BE
export const documentRevisionTypeFormOption = () => {
  const options: SelectOption[] = [];
  Object.keys(DocumentRevisionType).map((key) => {
    const keyName = DocumentRevisionType[key as keyof typeof DocumentRevisionType];
    options.push({value: key, text: keyName});
  });
  return _.orderBy(options, ["text"], ["asc"]);
};

export const documentRevisionReleasedDateOption = () => {
  return [
    {
      text: ReleasedDateOptions.LAST_WEEK,
      value: moment().subtract(7, "d").startOf("day").toISOString(),
    },
    {
      text: ReleasedDateOptions.LAST_TWO_WEEKS,
      value: moment().subtract(14, "d").startOf("day").toISOString(),
    },
    {
      text: ReleasedDateOptions.LAST_MONTH,
      value: moment().subtract(30, "d").startOf("day").toISOString(),
    },
  ];
};
