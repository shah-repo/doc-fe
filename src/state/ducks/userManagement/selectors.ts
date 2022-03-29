import { chain, each, groupBy, map, pick } from "lodash";
import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { ACTION_TITLE_MAPPIING } from "./types";

const groupsById = (state: ApplicationState) => state.userManagement.groupsById;
const groupsAllIds = (state: ApplicationState) => state.userManagement.groupsAllIds;
const getLoadGroupsAsyncState = (state: ApplicationState): AsyncState => state.userManagement.loadGroupsListAsyncInfo;

const getGroupsOptions = createSelector(
  groupsAllIds, groupsById,
  (ids, groups) => (
    ids.map((id) => ({
      label: groups[id].name,
      text: groups[id].name,
      value: groups[id].id,
      tags: groups[id].tags,
      type: groups[id].type,
      defaultForNewUsers: groups[id].defaultForNewUsers,
      permissions: groups[id].permissions,
      parents: groups[id].parents,
      joinedParents: groups[id].joinedParents,
      isOfficial: groups[id].isOfficial,
    }))
  ),
);

const getDefaultGroups = createSelector(
  getGroupsOptions,
  (groupOptions) => groupOptions.filter((option) => option.defaultForNewUsers),
);

const getOfficialGroups = createSelector(
  getGroupsOptions,
  (groupOptions) => groupOptions.filter((option) => option.isOfficial),
);

const historyList = (state: ApplicationState) => state.userManagement.history;

const getActionInfo = (groupItem) => {
  let actionInfo = {
    action: "Unknown",
    value: groupItem,
  };
  if (groupItem.fieldPath === "name" && groupItem.type === "STRING_EDITED") {
    actionInfo = {
      action: ACTION_TITLE_MAPPIING.EmployeeNameUpdated,
      value: `${groupItem.previousValue} to ${groupItem.nextValue}`,
    };
  } else if (groupItem.fieldPath === "groups" && groupItem.type === "ARRAY_NEW") {
    if (groupItem.previousValue === "undefined") {
      actionInfo = {
        action: ACTION_TITLE_MAPPIING.AddedToGroups,
        value: groupItem.nextValue,
      };
    }
  } else if (groupItem.fieldPath === "groups" && groupItem.type === "ARRAY_DELETED") {
    actionInfo = {
      action: ACTION_TITLE_MAPPIING.DeletedFromGroup,
      value: groupItem.previousValue,
    };
  } else if (groupItem.fieldPath === "active" && groupItem.type === "BOOLEAN_NEW") {
    actionInfo = {
      action: ACTION_TITLE_MAPPIING.CreatedNewUser,
      value: groupItem.employeeName,
    };
  } else if (groupItem.fieldPath === "name" && groupItem.type === "STRING_NEW") {
    actionInfo = {
      action: ACTION_TITLE_MAPPIING.ActivateUser,
      value: "Active",
    };
  }
  else if (groupItem.fieldPath === "active" && groupItem.type === "BOOLEAN_EDITED") {
    if (groupItem.previousValue === "true" && groupItem.nextValue === "false") {
      actionInfo = {
        action: ACTION_TITLE_MAPPIING.DeactivateUser,
        value: groupItem.employeeName,
      };
    }
    if (groupItem.previousValue === "false" && groupItem.nextValue === "true") {
      actionInfo = {
        action: ACTION_TITLE_MAPPIING.ActivateUser,
        value: groupItem.nextValue === "true" ? "Active" : "Inactive",
      };
    }
  }
  return actionInfo;
};
const historyGroups = (state: ApplicationState) => {
  // console.log("debug :: state.userManagement.history :: ", state.userManagement.history);
  // const response = state.userManagement.history.results
  const response = {
    pageTotal: 5,
    results: [
      {
        createdAt: "2022-03-29T12:56:05.621Z",
        updatedAt: "2022-03-29T12:56:05.621Z",
        internalTags: [],
        id: "43654e2d-676d-46bf-989e-f36ea656b8ef",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
        userId: "79725a72-de90-4a81-8b66-bd529f8e6011",
        approvalId: null,
        companyGroupId: null,
        type: "ARRAY_NEW",
        fieldType: "ARRAY",
        fieldPath: "groups",
        timestamp: "2022-03-29T12:56:05.663Z",
        previousValue: "undefined",
        nextValue: "546da05f-cdb6-44c6-900d-9fa83d9ddba9",
        groupId: "e6b99d61-565d-4b91-83ee-a804712e44a9",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
        user: {
          createdAt: "2022-03-29T12:02:59.394Z",
          updatedAt: "2022-03-29T12:02:59.394Z",
          internalTags: [],
          id: "79725a72-de90-4a81-8b66-bd529f8e6011",
          email: "sveerashetty@enlil.com",
          name: "Shiv",
          confirmed: false,
          locked: false,
          passwordExpires: true,
          passwordLastEmailSentAt: null,
          passwordUpdatedAt: null,
          permissions: null,
          avatar: null,
          initialColor: "#c1f9ff",
          resetPasswordEmailTimestamp: null,
          resendConfirmationEmailTimestamp: null,
          forgotPasswordEmailTimestamp: null,
          passwordSetTimestamp: null,
        },
        employeeName: "Shiv",
      },
      {
        createdAt: "2022-03-29T12:30:54.289Z",
        updatedAt: "2022-03-29T12:30:54.289Z",
        internalTags: [],
        id: "1199230a-2724-4fff-a7d6-c11b746b4f68",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
        userId: "79725a72-de90-4a81-8b66-bd529f8e6011",
        approvalId: null,
        companyGroupId: null,
        type: "ARRAY_DELETED",
        fieldType: "ARRAY",
        fieldPath: "groups",
        timestamp: "2022-03-29T12:30:54.308Z",
        previousValue: "546da05f-cdb6-44c6-900d-9fa83d9ddba9",
        nextValue: "undefined",
        groupId: "32384fb3-8b59-47b0-bccc-5d8b3ce21423",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
        user: {
          createdAt: "2022-03-29T12:02:59.394Z",
          updatedAt: "2022-03-29T12:02:59.394Z",
          internalTags: [],
          id: "79725a72-de90-4a81-8b66-bd529f8e6011",
          email: "sveerashetty@enlil.com",
          name: "Shiv",
          confirmed: false,
          locked: false,
          passwordExpires: true,
          passwordLastEmailSentAt: null,
          passwordUpdatedAt: null,
          permissions: null,
          avatar: null,
          initialColor: "#c1f9ff",
          resetPasswordEmailTimestamp: null,
          resendConfirmationEmailTimestamp: null,
          forgotPasswordEmailTimestamp: null,
          passwordSetTimestamp: null,
        },
        employeeName: "Shiv",
      },
      {
        createdAt: "2022-03-29T12:26:45.508Z",
        updatedAt: "2022-03-29T12:26:45.508Z",
        internalTags: [],
        id: "d0343d9e-e69d-4f2b-928f-26c7e5991035",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
        userId: null,
        approvalId: null,
        companyGroupId: null,
        type: "BOOLEAN_EDITED",
        fieldType: "BOOLEAN",
        fieldPath: "active",
        timestamp: "2022-03-29T12:26:45.512Z",
        previousValue: "false",
        nextValue: "true",
        groupId: "2fd2e188-2cc8-4fb0-a153-67f277aa7e16",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
        employeeName: "Shiv",
      },
      {
        createdAt: "2022-03-29T12:26:08.875Z",
        updatedAt: "2022-03-29T12:26:08.875Z",
        internalTags: [],
        id: "31f84b9b-6a95-42a1-985a-f9d39f0daef9",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
        userId: null,
        approvalId: null,
        companyGroupId: null,
        type: "BOOLEAN_EDITED",
        fieldType: "BOOLEAN",
        fieldPath: "active",
        timestamp: "2022-03-29T12:26:08.894Z",
        previousValue: "true",
        nextValue: "false",
        groupId: "73801f35-780f-43a5-a8fe-867ca5242b1a",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
        employeeName: "Shiv",
      },
      {
        createdAt: "2022-03-29T12:02:59.394Z",
        updatedAt: "2022-03-29T12:02:59.394Z",
        internalTags: [],
        id: "ed9725c4-d7f3-4280-b72a-d53d2ce06c7c",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: null,
        userId: "79725a72-de90-4a81-8b66-bd529f8e6011",
        approvalId: null,
        companyGroupId: null,
        type: "STRING_NEW",
        fieldType: "STRING",
        fieldPath: "name",
        timestamp: "2022-03-29T12:02:59.406Z",
        previousValue: "undefined",
        nextValue: "Shiv",
        groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
      },
      {
        createdAt: "2022-03-29T12:02:59.394Z",
        updatedAt: "2022-03-29T12:02:59.394Z",
        internalTags: [],
        id: "d3c07d6b-7bbc-439e-a73c-ef8fb2cc67d1",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
        userId: null,
        approvalId: null,
        companyGroupId: null,
        type: "BOOLEAN_NEW",
        fieldType: "BOOLEAN",
        fieldPath: "active",
        timestamp: "2022-03-29T12:03:01.456Z",
        previousValue: "undefined",
        nextValue: "true",
        groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
        employeeName: "Shiv",
      },
      {
        createdAt: "2022-03-29T12:02:59.394Z",
        updatedAt: "2022-03-29T12:02:59.394Z",
        internalTags: [],
        id: "3ea641e2-f438-4ee1-8ea2-13a72619dbc6",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
        userId: null,
        approvalId: null,
        companyGroupId: null,
        type: "ARRAY_NEW",
        fieldType: "ARRAY",
        fieldPath: "groups",
        timestamp: "2022-03-29T12:03:01.456Z",
        previousValue: "undefined",
        nextValue: "546da05f-cdb6-44c6-900d-9fa83d9ddba9",
        groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
        employeeName: "Shiv",
      },
      {
        createdAt: "2022-03-29T12:02:59.394Z",
        updatedAt: "2022-03-29T12:02:59.394Z",
        internalTags: [],
        id: "e7fcee54-1a70-4d68-8e69-a4d5308f497c",
        changeRequestId: null,
        documentRevisionId: null,
        referenceId: null,
        employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
        userId: null,
        approvalId: null,
        companyGroupId: null,
        type: "ARRAY_NEW",
        fieldType: "ARRAY",
        fieldPath: "groups",
        timestamp: "2022-03-29T12:03:01.456Z",
        previousValue: "undefined",
        nextValue: "0a91f1f3-36aa-4a9e-b4d4-8d7e58b6afaf",
        groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
        ownerId: "847d69b0-55a7-401e-b781-7c0e0b204137",
        server: null,
        ownerUserId: null,
        ownerThirdPartyId: null,
        fileUploadCandidatesId: null,
        companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
        attachmentId: null,
        ownerName: "Zoran Company Admin",
        ownerEmail: "zoran.kovacevic+ca@codecons.com",
        unknown: null,
        employeeName: "Shiv",
      },
    ],
    total: 5,
  };
  // Enrich Audi Records with uniq groupKey and action info
  const auditRecords = map(response.results as any, (auditRecord) => ({
    ...auditRecord,
    groupKey: `${auditRecord.groupId}-${auditRecord.timestamp}-${auditRecord.ownerId}`,
    actionInfo: getActionInfo(auditRecord),
  }));
  const auditRecordGroups = groupBy(auditRecords, "groupKey");
  // Create a Group Data for each Card to be represented
  const cardGroups = {};
  each(auditRecordGroups, (groupedItems, groupKey) => {
    cardGroups[groupKey] = {
      ...pick(auditRecordGroups[groupKey][0], ["ownerId", "ownerName", "ownerEmail", "timestamp", "employeeName", "id", "nextValue"]),
      items: map(groupedItems, (groupItem) => ({ ...groupItem.actionInfo })),
    };
  });
  // Make uniq values
  each(cardGroups, (data: any, key) => {
    cardGroups[key].groupItems = chain(data.items)
      .groupBy("action")
      .map((itemGroup, action) => {
        const items = map(itemGroup, "value");
        return {
          primaryText: action,
          secondayText: items.join(","),
          employeeName: data.employeeName,
        };
      })
      .value();
  });
  return cardGroups;
};
const getLoadHistoryListAsyncInfo = (state: ApplicationState): AsyncState => state.userManagement.loadHistoryAsyncInfo;

export default {
  getGroupsOptions,
  getLoadGroupsAsyncState,
  getDefaultGroups,
  getOfficialGroups,
  getLoadHistoryListAsyncInfo,
  historyList,
  historyGroups,
  groupsById,
};
