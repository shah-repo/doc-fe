import { get, orderBy } from "lodash";
import moment from "moment";
import "moment-timezone";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { store } from "../../../state/store";
import { SelectOption } from "../../components/forms/fields/Select";
import { CompletedOnDateOptions, ReleasedDateOptions } from "./types";

const isDraft = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.Draft;

const isPendingChange = (documentRevision: DocumentRevision) =>
  documentRevision.status === DocumentRevisionStatus.PendingChange;

export const canEditDocumentRevision = (documentRevision: DocumentRevision) => {
  const owner = get(documentRevision, "owner.user.email");
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

export const documentRevisionStatusOption = () => {
  const options: SelectOption[] = [];
  Object.keys(DocumentRevisionStatus).forEach((key) => {
    // TODO: Change DocumentRevisionStatus enum into key = value, value = text
    const keyName = DocumentRevisionStatus[key as keyof typeof DocumentRevisionStatus];
    if (keyName !== DocumentRevisionStatus.Deprecated && keyName !== DocumentRevisionStatus.Canceled) {
      options.push({ value: keyName, text: keyName });
    }
  });
  return orderBy(options, ["text"], ["asc"]);
};

export const documentRevisionQueryStatus = (): DocumentRevisionStatus[] =>
  Object
    .values(DocumentRevisionStatus)
    .filter((value) => value !== DocumentRevisionStatus.Deprecated && value !== DocumentRevisionStatus.Canceled);

export const documentRevisionEffectiveDateOption = () => [
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

export const trainingCompletedOnDateOption = () => [
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
  {
    text: CompletedOnDateOptions.PENDING,
    value: "pending",
  },
];
