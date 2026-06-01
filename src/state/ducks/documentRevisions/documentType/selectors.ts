import { get, orderBy } from 'lodash';
import { createSelector } from 'reselect';
import { DocumentTypeRestriction } from '../../../../ui/administration/general.settings/panels/CreationRestrictions/types';
import { removeLastCharacterIfNotAlphaNumeric } from '../../../../ui/common/utils/helpers';
import { checkIfDocumentHasOptions } from '../../../../ui/documentRevision/helpers/checkDocumentGroup';
import { ApplicationState } from '../../../reducers';
import { AsyncState } from '../../../types';
import { authSelectors } from '../../auth';
import { companySelectors } from '../../company';
import { DocumentCategory } from '../types';
import { DOC_TYPE_GROUP_OPTION, DocumentGroupType, DocumentType, DocumentTypeByIdState, TabInfo } from './types';

const allIds = (state: ApplicationState) => state.documentType.allIds;
const allDocTypeIdsByCategory = (state: ApplicationState) => state.documentType.allDocTypeIdsByCategory;
const creationRestrictions = (state: ApplicationState): DocumentTypeRestriction[] => state.company.generalSettings.creationRestrictions;

const byId = (state: ApplicationState) => state.documentType.byId;

const { currentEmployeeId, currentUserGroups } = authSelectors;
const { getCreationRestrictionsMap } = companySelectors;
const currentUserGroupIds = createSelector([currentUserGroups], (groups) => groups.map((group) => group.id));

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
      , ['documentTypeName'], ['asc']),
);

const getDocumentTypeOptions = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    orderBy(
      ids.map((id) => ({
        value: documentTypes[id].id,
        text: removeLastCharacterIfNotAlphaNumeric(documentTypes[id].documentTypeAcronym),
      }))
      , ['text'], ['asc']),
);

const getDocumentTypeOptionsForDocumentList = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    orderBy(
      ids.filter((id) => documentTypes[id].active
        && !checkIfDocumentHasOptions(
          [
            DOC_TYPE_GROUP_OPTION.RECORD,
            DOC_TYPE_GROUP_OPTION.EQUIPMENT,
            DOC_TYPE_GROUP_OPTION.ENGINEERING_BUILD,
            DOC_TYPE_GROUP_OPTION.PART,
            DOC_TYPE_GROUP_OPTION.SUPPLIER,
            DOC_TYPE_GROUP_OPTION.PO,
            DOC_TYPE_GROUP_OPTION.RECEIVABLE,
            DOC_TYPE_GROUP_OPTION.GROUP_TRAINING,
          ],
          documentTypes[id].groupOptions,
        ),
      )
        .map((id) => ({
          value: documentTypes[id].id,
          text: removeLastCharacterIfNotAlphaNumeric(documentTypes[id].documentTypeAcronym),
        }))
      , ['text'], ['asc']),
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

const getDocumentTypeByGroup = createSelector(
  byId,
  (state: ApplicationState, group: DOC_TYPE_GROUP_OPTION) => group,
  (docTypesById: DocumentTypeByIdState, group: DOC_TYPE_GROUP_OPTION) =>
    Object
      .values(docTypesById)
      .find((docType) => docType.group === group),
);

const docRevTypeById = (state: ApplicationState) => state.documentType.docRevTypeId.forms[0]
  ? state.documentType.docRevTypeId.forms[0].id : '';

const docRevTypeForms = (state: ApplicationState) => state.documentType.docRevTypeId.forms;

const getDocumentTypesByCategory = (state: ApplicationState) => state.documentType.docTypesByCategory;

const getDocumentTypeNumberingStye = (state: ApplicationState) => state.documentType.docRevTypeId.numberingStyle;

const getTabConfiguration = (state: ApplicationState, group: DocumentGroupType): TabInfo[] =>
  state.documentType.tabsConfiguration[group];

const getDocTypeName = createSelector(
  byId,
  (state, docTypeId) => docTypeId,
  (byIds, docTypeId) => get(byIds[docTypeId], 'documentTypeName', 'N/A'),
);

const getDocTypeCategory = createSelector(
  byId,
  (state, docTypeId) => docTypeId,
  (byIds, docTypeId) => get(byIds[docTypeId], 'category', 'N/A'),
);

const getDocTypeNumOfRevStages = createSelector(
  companySelectors.getCompanyMaxRevisionStage,
  getDocTypeCategory,
  (companyMaxRevisionStage, docTypeCategory) => {
    // Some categories aren't available for NumericAlpha.
    return [
      DocumentCategory.Supplier,
      DocumentCategory.TrainingCurriculums,
      DocumentCategory.Equipment,
    ].includes(docTypeCategory as DocumentCategory)
      ? 2
      : companyMaxRevisionStage;
  },
);

const makeGetDocTypeByAcronym = () => createSelector(
  (state: ApplicationState) => getDocumentTypeList(state),
  (state: ApplicationState, acronym: string) => acronym,
  (docTypeList, acronym) => docTypeList.find((docType) => docType.documentTypeAcronym === acronym),
);

export const canCreateCategory = createSelector(
  allDocTypeIdsByCategory, getCreationRestrictionsMap, currentEmployeeId, currentUserGroupIds,
  (state: ApplicationState, category: string) => category,
  (allDocTypeIdsByCategory, getCreationRestrictionsMap, employeeId, groupIds, category) => {
    const categoryDocumentTypeIds: string[] = allDocTypeIdsByCategory[category] ?? [];

    // If not all of them have entry in the creationRestrictions
    const eachDocTypeHasRestrictions = categoryDocumentTypeIds.every(docTypeId => {
      const creationRestrictions = getCreationRestrictionsMap[docTypeId];
      return creationRestrictions?.restrictedToRoles?.length || creationRestrictions?.restrictedToUsers?.length;
    });
    if (!eachDocTypeHasRestrictions) {
      return true;
    }

    // When all documentTypes under a category have been marked for restriction, need to generate a combined list.
    const combinedRestrictedToUsers: string[] = [];
    const combinedRestrictedToRoles: string[] = [];
    categoryDocumentTypeIds.forEach(docTypeId => {
      combinedRestrictedToUsers.push(...(getCreationRestrictionsMap[docTypeId].restrictedToUsers ?? []));
      combinedRestrictedToRoles.push(...(getCreationRestrictionsMap[docTypeId].restrictedToRoles ?? []));
    });

    const hasUserAccess = combinedRestrictedToUsers.includes(employeeId);
    const hasGroupAccess = groupIds.some((groupId) => combinedRestrictedToRoles.includes(groupId));
    return hasUserAccess || hasGroupAccess;
  },
);

const canCreateDocumentType = createSelector(
  creationRestrictions, currentEmployeeId, currentUserGroupIds,
  (state: ApplicationState, documentTypeId: string) => documentTypeId,
  (creationRestrictions, employeeId, currentUserGroupIds, documentTypeId) => {
    const docTypeCreationRestrictions
        = creationRestrictions.find((restriction) => restriction.documentTypeId === documentTypeId);
    if (!docTypeCreationRestrictions) {
      return true;
    }

    if (!docTypeCreationRestrictions.restrictedToUsers?.length
      && !docTypeCreationRestrictions.restrictedToRoles?.length) {
      return true;
    }

    const hasUserAccess = docTypeCreationRestrictions.restrictedToUsers?.includes(employeeId);
    const hasGroupAccess = currentUserGroupIds.some((groupId) => docTypeCreationRestrictions.restrictedToRoles?.includes(groupId));
    return hasUserAccess || hasGroupAccess;
  },
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
  getDocumentTypeByGroup,
  docRevTypeById,
  getDocTypeName,
  getDocTypeCategory,
  getDocTypeNumOfRevStages,
  docRevTypeForms,
  makeGetDocTypeByAcronym,
  getDocumentTypesByCategory,
  getDocumentTypeNumberingStye,
  getTabConfiguration,
  canCreateCategory,
  canCreateDocumentType,
};
