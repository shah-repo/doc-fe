import { DTMAddRow } from '../types';

export const NewRowObject: DTMAddRow = {
  documentTypeName: '',
  documentTypeAcronym: '',
  privateNumberPool: false,
  canRedLine: false,
  isQms: false,
  needsSignature: false,
  defaultTraining: false,
  startingNumber: 1,
  hiddenForCreationForUsersWithoutTags: [],
  group: '',
  category: null,
  schema: [],
  fieldsConfig: undefined,
  defaultRevStage: null,
  active: true,
  isNewRecord: false,
};
