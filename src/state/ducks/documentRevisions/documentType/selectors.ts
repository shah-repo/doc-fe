import { get, orderBy } from "lodash";
import { createSelector } from "reselect";
import { removeLastCharacterIfNotAlphaNumeric } from "../../../../ui/common/utils/helpers";
import { checkIfDocumentHasOptions } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { ApplicationState } from "../../../reducers";
import { AsyncState } from "../../../types";
import { DocumentType, DOC_TYPE_GROUP_OPTION } from "./types";

const allIds = (state: ApplicationState) => state.documentType.allIds;
const byId = (state: ApplicationState) => state.documentType.byId;

const getDocumentTypeById = (state: ApplicationState, id: string) =>
  state.documentType.byId[id];

const getDocumentTypeList = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    ids.map((id) => documentTypes[id]),
);

const getDocumentTypesWithPageDetails = createSelector(
  allIds,
  byId,
  (ids, documentTypes) =>
    ids.reduce((documentsWithPageDetails: DocumentType[], id: string) => {
      if (documentTypes[id].pageDetails) {
        documentsWithPageDetails.push(documentTypes[id]);
      }
      return documentsWithPageDetails;
    }, []),
);

const getDocumentTypeFormOptions = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    orderBy(
      ids.map((id) => ({
        ...documentTypes[id],
      }))
      , ["documentTypeName"], ["asc"]),
);

const getDocumentTypeOptions = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    orderBy(
      ids.map((id) => ({
        value: documentTypes[id].id,
        text: removeLastCharacterIfNotAlphaNumeric(documentTypes[id].documentTypeAcronym),
      }))
      , ["text"], ["asc"]),
);

const getDocumentTypeOptionsForDocumentList = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    orderBy(
      ids.filter((id) =>  documentTypes[id].active
        && !checkIfDocumentHasOptions(
          [
            DOC_TYPE_GROUP_OPTION.RECORD,
            DOC_TYPE_GROUP_OPTION.EQUIPMENT,
            DOC_TYPE_GROUP_OPTION.ENGINEERING_BUILD,
            DOC_TYPE_GROUP_OPTION.PART,
            DOC_TYPE_GROUP_OPTION.SUPPLIER,
            DOC_TYPE_GROUP_OPTION.PO,
            DOC_TYPE_GROUP_OPTION.RECEIVABLE,
          ],
          documentTypes[id].groupOptions
        )
      )
        .map((id) => ({
          value: documentTypes[id].id,
          text: removeLastCharacterIfNotAlphaNumeric(documentTypes[id].documentTypeAcronym),
        }))
      , ["text"], ["asc"]),
);

const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documentType.loadListAsyncInfo;

const getDocumentTypeByAcronym = createSelector(
  byId,
  (state, acronym: string) => acronym,
  (docTypesById, acronym) =>
    Object
      .values(docTypesById)
      .find((docType) => docType.documentTypeAcronym.toLowerCase() === acronym.toLowerCase()),
);
const docRevTypeById = (state: ApplicationState) => state.documentType.docRevTypeId.forms[0] ?
  state.documentType.docRevTypeId.forms[0].id : "";

const formIds = (state: ApplicationState) => state.documentType.docRevTypeId.forms;

const getDocumentTypesByCategory = (state: ApplicationState) => state.documentType.docTypesByCategory;

const getDocTypeName = createSelector(
  byId,
  (state, docTypeId) => docTypeId,
  (byIds, docTypeId) => get(byIds[docTypeId], "documentTypeName", "N/A"),
);

const makeGetDocTypeByAcronym = () => createSelector(
  (state: ApplicationState) => getDocumentTypeList(state),
  (state: ApplicationState, acronym: string) => acronym,
  (docTypeList, acronym) => docTypeList.find((docType) => docType.documentTypeAcronym === acronym),
);


export default {
  byId,
  getDocumentTypeList,
  getDocumentTypeFormOptions,
  getDocumentTypeOptions,
  getDocumentTypeOptionsForDocumentList,
  getLoadListAsyncState,
  getDocumentTypeById,
  getDocumentTypesWithPageDetails,
  getDocumentTypeByAcronym,
  docRevTypeById,
  getDocTypeName,
  formIds,
  makeGetDocTypeByAcronym,
  getDocumentTypesByCategory,
};
