import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const TestDocumentType: IdocumentTypeDto =  {
  documentTypeName: "Test Document Type",
  documentTypeAcronym: "TDT-",
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
  canRedLine: true,
};

export const TestDocumentTypeRecord: IdocumentTypeDto = {
  documentTypeName: "Test Document Type",
  documentTypeAcronym: "TDT-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  canRedLine: true,
  fieldsConfig: {
    A1: {
      label: "WIP",
      visible: true,
    },
  },
};

export const HistoryTestRecord: IdocumentTypeDto =   {
  documentTypeName: "History Test Record",
  documentTypeAcronym: "HTR-",
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  needsSignature: true,
  category: Categories.Record,
};

export const RecordDocumentType: IdocumentTypeDto = {
  documentTypeName: "Record Document",
  documentTypeAcronym: "RD-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
};

export const AdditionalType: IdocumentTypeDto =    {
  documentTypeName: "Additional Document Type",
  documentTypeAcronym: "ADT-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  canRedLine: true,
  fieldsConfig: {
    A1: {
      label: "WIP",
      visible: true,
    },
  },
};

export const ApprovalsInlineType: IdocumentTypeDto = {
  documentTypeName: "Approvals Inline Type",
  documentTypeAcronym: "AIT-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  canRedLine: true,
  fieldsConfig: {
    A1: {
      label: "WIP",
      visible: true,
    },
  },
};

export const ApprovalsDocType: IdocumentTypeDto = {
  documentTypeName: "Approvals Document Type",
  documentTypeAcronym: "ADT-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  canRedLine: true,
  fieldsConfig: {
    A1: {
      label: "WIP",
      visible: true,
    },
  },
};

export const PrivatePoolTest: IdocumentTypeDto = {
  documentTypeName: "Test Private Pool",
  documentTypeAcronym: "TPP-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  canRedLine: true,
  privateNumberPool: true,
  fieldsConfig: {
    A1: {
      label: "WIP",
      visible: true,
    },
  },
};

export const PublicPoolTest: IdocumentTypeDto = {
  documentTypeName: "Test Public Pool",
  documentTypeAcronym: "TPUP-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  canRedLine: true,
  privateNumberPool: false,
  fieldsConfig: {
    A1: {
      label: "WIP",
      visible: true,
    },
  },
};

export const NonQMSType: IdocumentTypeDto = {
  documentTypeName: "NonQMS Document",
  documentTypeAcronym: "NQ",
  group: DOC_TYPE_GROUP.OTHER,
  isQms: false,
};

export const DesignDocument: IdocumentTypeDto =  {
  documentTypeName: "Design Document",
  documentTypeAcronym: "DD-",
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
  canRedLine: true,
};
