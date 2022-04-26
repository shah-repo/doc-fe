import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { DEFAUL_REV_STAGE, IdocumentTypeDto } from "../../../support/commands";

export const EngineeringBuild: IdocumentTypeDto = {
  documentTypeName: "Engineering Build Test",
  documentTypeAcronym: "EB-",
  privateNumberPool: true,
  canRedLine: false,
  isQms: true,
  needsSignature: true,
  defaultTraining: false,
  startingNumber: 1,
  hiddenForCreationForUsersWithoutTags: [],
  group: DOC_TYPE_GROUP.ENGINEERING_BUILD,
  category: "EB",
  schema: [],
  defaultRevStage: DEFAUL_REV_STAGE.ALPHA,
  active: true,
};

export const EBExport: IdocumentTypeDto =  {
  documentTypeName: "ENGINEERING BUILD",
  documentTypeAcronym: "EB-",
  category: "EB",
  group: DOC_TYPE_GROUP.ENGINEERING_BUILD,
  isQms: true,
  fieldsConfig: {
    D: {
      label: "Description",
      visible: true,
      required: true,
    },
    E: {
      label: "Record Type",
      visible: true,
      required: true,
    },
    F: {
      label: "Record ID",
      visible: false,
      required: true,
    },
    G: {
      visible: false,
      required: false,
    },
    I: {
      visible: false,
    },
    J: {
      visible: false,
    },
    K: {
      label: "Void",
      visible: true,
    },
    L: {
      label: "Correction",
      visible: true,
    },
    N: {
      label: "Finalize and Release",
      visible: true,
    },
    O: {
      label: "Record History",
      visible: true,
    },
    R: {
      visible: false,
    },
    S: {
      label: "Update Record",
      visible: true,
    },
    A1: {
      label: "WIP",
      visible: true,
    },
    A2: {
      label: "Voided",
      visible: true,
    },
    A3: {
      label: "Archive",
      visible: true,
    },
    P1: {
      label: "WIP",
      visible: true,
    },
    P2: {
      label: "Voided",
      visible: true,
    },
    P3: {
      label: "Archive",
      visible: true,
    },
  },
};
