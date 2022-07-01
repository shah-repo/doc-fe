import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

const ATTACHMENT_BUILT_IN_KEY = "fb-attachment-built-in";
const ATTACHMENTS = "attachments";
const ON_STATE_TO_IN_REVIEW = "ON_STATE_TO_IN_REVIEW";

export const LegalRecord: IdocumentTypeDto = {
  documentTypeName: "Legal Record",
  documentTypeAcronym: "LR-",
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  needsSignature: true,
  category: Categories.Record,
};

export const RecordOne: IdocumentTypeDto = {
  documentTypeName: "Record one",
  documentTypeAcronym: "RD-",
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  needsSignature: true,
  category: Categories.Record,
  schema: [{
    index: 0,
    name: ATTACHMENT_BUILT_IN_KEY,
    label: "Attachments",
    type: ATTACHMENTS,
    applicableOn: [
      ON_STATE_TO_IN_REVIEW,
    ],
    deleteDisabled: true,
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
    tabId: "overview",
  }],
};
