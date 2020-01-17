import _ from "lodash";
import { createSelector } from "reselect";
import { ApplicationState } from "../../../reducers";
import { AsyncState } from "../../../types";
import { DocumentType } from "./types";

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
    _.orderBy(
      ids.map((id) => {
        return {
          id: documentTypes[id].id,
          documentTypeName: documentTypes[id].documentTypeName,
          documentTypeAcronym: documentTypes[id].documentTypeAcronym,
          group: documentTypes[id].group,
        };
      })
      , ["documentTypeName"], ["asc"]),
);

const getDocumentTypeOptions = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    _.orderBy(
      ids.map((id) => {
        return {
          value: documentTypes[id].id,
          text: documentTypes[id].documentTypeAcronym,
        };
      })
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

const isSingleDocRevId = (state: ApplicationState): boolean => state.documentType.docRevTypeId.forms.length === 1;
const docRevTypeById = (state: ApplicationState) => state.documentType.docRevTypeId.forms[0].id;

export default {
  byId,
  getDocumentTypeList,
  getDocumentTypeFormOptions,
  getDocumentTypeOptions,
  getLoadListAsyncState,
  getDocumentTypeById,
  getDocumentTypesWithPageDetails,
  getDocumentTypeByAcronym,
  isSingleDocRevId,
  docRevTypeById,
};
