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
  } else if (groupItem.fieldPath === "active" && groupItem.type === "BOOLEAN_NEW") {
    actionInfo = {
      action: ACTION_TITLE_MAPPIING.CreatedNewUser,
      value: groupItem.employeeName,
    };
  } else if (groupItem.fieldPath === "name" && groupItem.type === "STRING_NEW") {
    actionInfo = {
      action: ACTION_TITLE_MAPPIING.ActivateUser,
      value: groupItem.nextValue,
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
        value: groupItem.nextValue,
      };
    }
  }
  return actionInfo;
};
const historyGroups = (state: ApplicationState) => {
  const response = [
    {
      createdAt: "2022-03-28T09:13:53.697Z",
      updatedAt: "2022-03-28T09:13:53.697Z",
      id: "ac1081be-9763-483b-867c-1260722f6bf1",
      changeRequestId: null,
      documentRevisionId: null,
      referenceId: null,
      employeeId: null,
      userId: "32bf61cf-9619-4a10-8716-104b78f2b234",
      approvalId: null,
      companyGroupId: null,
      type: "STRING_EDITED",
      fieldType: "STRING",
      fieldPath: "name",
      timestamp: "2022-03-28T09:13:53.703Z",
      previousValue: "Abhishek",
      nextValue: "Abhishek Jain",
      groupId: "fb9f3537-f37a-419b-84dc-5f8f92ea4f4b",
      ownerId: "40558ca1-672e-4aa2-b7c0-cff075c7e6b3",
      server: null,
      ownerUserId: null,
      ownerThirdPartyId: null,
      fileUploadCandidatesId: null,
      companyId: "5ab78311-cb06-498f-b373-0355689aaef0",
      attachmentId: null,
      ownerName: "Zoran Company Admin",
      ownerEmail: "zoran.kovacevic+ca@codecons.com",
      unknown: null,
    },
    {
      createdAt: "2022-03-28T09:11:55.786Z",
      updatedAt: "2022-03-28T09:11:55.786Z",
      id: "b1f8ebce-0f2a-480e-afd9-da0ab0f40e6e",
      changeRequestId: null,
      documentRevisionId: null,
      referenceId: null,
      employeeId: null,
      userId: "32bf61cf-9619-4a10-8716-104b78f2b234",
      approvalId: null,
      companyGroupId: null,
      type: "STRING_NEW",
      fieldType: "STRING",
      fieldPath: "name",
      timestamp: "2022-03-28T09:11:55.805Z",
      previousValue: "undefined",
      nextValue: "Abhishek",
      groupId: "08737b9e-7df0-409c-8f40-4263261920d9",
      ownerId: "40558ca1-672e-4aa2-b7c0-cff075c7e6b3",
      server: null,
      ownerUserId: null,
      ownerThirdPartyId: null,
      fileUploadCandidatesId: null,
      companyId: "5ab78311-cb06-498f-b373-0355689aaef0",
      attachmentId: null,
      ownerName: "Zoran Company Admin",
      ownerEmail: "zoran.kovacevic+ca@codecons.com",
      unknown: null,
    },
    {
      createdAt: "2022-03-28T09:11:55.786Z",
      updatedAt: "2022-03-28T09:11:55.786Z",
      internalTags: [],
      id: "e8da330e-6eec-41ff-af1c-89c359388b0a",
      changeRequestId: null,
      documentRevisionId: null,
      referenceId: null,
      employeeId: "ed8215a9-5da6-44f9-a8d0-79e7c6c15315",
      userId: null,
      approvalId: null,
      companyGroupId: null,
      type: "ARRAY_NEW",
      fieldType: "ARRAY",
      fieldPath: "groups",
      timestamp: "2022-03-28T09:11:57.065Z",
      previousValue: "undefined",
      nextValue: "a23f9dc1-96b1-4584-9387-c6dd89fd0c99",
      groupId: "08737b9e-7df0-409c-8f40-4263261920d9",
      ownerId: "40558ca1-672e-4aa2-b7c0-cff075c7e6b3",
      server: null,
      ownerUserId: null,
      ownerThirdPartyId: null,
      fileUploadCandidatesId: null,
      companyId: "5ab78311-cb06-498f-b373-0355689aaef0",
      attachmentId: null,
      ownerName: "Zoran Company Admin",
      ownerEmail: "zoran.kovacevic+ca@codecons.com",
      unknown: null,
      employeeName: "Abhishek",
    },
    {
      createdAt: "2022-03-28T09:11:55.786Z",
      updatedAt: "2022-03-28T09:11:55.786Z",
      internalTags: [],
      id: "79bc7b3e-b440-44bf-9954-e444938f7276",
      changeRequestId: null,
      documentRevisionId: null,
      referenceId: null,
      employeeId: "ed8215a9-5da6-44f9-a8d0-79e7c6c15315",
      userId: null,
      approvalId: null,
      companyGroupId: null,
      type: "ARRAY_NEW",
      fieldType: "ARRAY",
      fieldPath: "groups",
      timestamp: "2022-03-28T09:11:57.065Z",
      previousValue: "undefined",
      nextValue: "7b099eab-dd52-4d2c-855f-bfeaa4dfe952",
      groupId: "08737b9e-7df0-409c-8f40-4263261920d9",
      ownerId: "40558ca1-672e-4aa2-b7c0-cff075c7e6b3",
      server: null,
      ownerUserId: null,
      ownerThirdPartyId: null,
      fileUploadCandidatesId: null,
      companyId: "5ab78311-cb06-498f-b373-0355689aaef0",
      attachmentId: null,
      ownerName: "Zoran Company Admin",
      ownerEmail: "zoran.kovacevic+ca@codecons.com",
      unknown: null,
      employeeName: "Abhishek",
    },
    {
      createdAt: "2022-03-28T09:11:55.786Z",
      updatedAt: "2022-03-28T09:11:55.786Z",
      internalTags: [],
      id: "55b70fb6-d2e5-4f69-b218-43f17bdec001",
      changeRequestId: null,
      documentRevisionId: null,
      referenceId: null,
      employeeId: "ed8215a9-5da6-44f9-a8d0-79e7c6c15315",
      userId: null,
      approvalId: null,
      companyGroupId: null,
      type: "BOOLEAN_NEW",
      fieldType: "BOOLEAN",
      fieldPath: "active",
      timestamp: "2022-03-28T09:11:57.065Z",
      previousValue: "undefined",
      nextValue: "true",
      groupId: "08737b9e-7df0-409c-8f40-4263261920d9",
      ownerId: "40558ca1-672e-4aa2-b7c0-cff075c7e6b3",
      server: null,
      ownerUserId: null,
      ownerThirdPartyId: null,
      fileUploadCandidatesId: null,
      companyId: "5ab78311-cb06-498f-b373-0355689aaef0",
      attachmentId: null,
      ownerName: "Zoran Company Admin",
      ownerEmail: "zoran.kovacevic+ca@codecons.com",
      unknown: null,
      employeeName: "Abhishek",
    },
    {
      createdAt: "2022-03-28T09:05:01.478Z",
      updatedAt: "2022-03-28T09:05:01.478Z",
      internalTags: [],
      id: "3772d1c5-d803-4705-9b72-1efdff3ad4a4",
      changeRequestId: null,
      documentRevisionId: null,
      referenceId: null,
      employeeId: "073172db-29f5-480b-9a6d-b6359620ded6",
      userId: "1fd84386-c475-4dc2-b35a-e36aff7ffca5",
      approvalId: null,
      companyGroupId: null,
      type: "ARRAY_NEW",
      fieldType: "ARRAY",
      fieldPath: "groups",
      timestamp: "2022-03-28T09:05:01.528Z",
      previousValue: "undefined",
      nextValue: "af568047-4153-4383-8304-b66f0018314a",
      groupId: "1a37b4ca-cc42-4fbe-8406-92d08ea11039",
      ownerId: "40558ca1-672e-4aa2-b7c0-cff075c7e6b3",
      server: null,
      ownerUserId: null,
      ownerThirdPartyId: null,
      fileUploadCandidatesId: null,
      companyId: "5ab78311-cb06-498f-b373-0355689aaef0",
      attachmentId: null,
      ownerName: "Zoran Company Admin",
      ownerEmail: "zoran.kovacevic+ca@codecons.com",
      unknown: null,
      user: {
        createdAt: "2022-03-28T08:57:22.292Z",
        updatedAt: "2022-03-28T08:57:22.292Z",
        internalTags: [],
        id: "1fd84386-c475-4dc2-b35a-e36aff7ffca5",
        email: "zoran.kovacevic+1@codecons.com",
        name: "Zoran First",
        confirmed: false,
        locked: false,
        passwordExpires: true,
        passwordLastEmailSentAt: null,
        passwordUpdatedAt: null,
        permissions: null,
        avatar: null,
        initialColor: null,
        resetPasswordEmailTimestamp: null,
        resendConfirmationEmailTimestamp: null,
        forgotPasswordEmailTimestamp: null,
        passwordSetTimestamp: null,
      },
      employeeName: "Zoran First",
    },
    {
      createdAt: "2022-03-28T09:25:09.451Z",
      updatedAt: "2022-03-28T09:25:09.451Z",
      internalTags: [],
      id: "92714e72-ceae-4e6d-9f5d-c5d81027f9d4",
      changeRequestId: null,
      documentRevisionId: null,
      referenceId: null,
      employeeId: "ed8215a9-5da6-44f9-a8d0-79e7c6c15315",
      userId: null,
      approvalId: null,
      companyGroupId: null,
      type: "BOOLEAN_EDITED",
      fieldType: "BOOLEAN",
      fieldPath: "active",
      timestamp: "2022-03-28T09:25:09.504Z",
      previousValue: "true",
      nextValue: "false",
      groupId: "f7ca4bf2-1858-4da5-a13f-25aa01accd81",
      ownerId: "40558ca1-672e-4aa2-b7c0-cff075c7e6b3",
      server: null,
      ownerUserId: null,
      ownerThirdPartyId: null,
      fileUploadCandidatesId: null,
      companyId: "5ab78311-cb06-498f-b373-0355689aaef0",
      attachmentId: null,
      ownerName: "Zoran Company Admin",
      ownerEmail: "zoran.kovacevic+ca@codecons.com",
      unknown: null,
      employeeName: "Abhishek Jain",
    },
  ];
  // Enrich Audi Records with uniq groupKey and action info
  const auditRecords = map(response, (auditRecord) => ({
    ...auditRecord,
    groupKey: `${auditRecord.groupId}-${auditRecord.timestamp}-${auditRecord.ownerId}`,
    actionInfo: getActionInfo(auditRecord),
  }));
  const auditRecordGroups = groupBy(auditRecords, "groupKey");
  // Create a Group Data for each Card to be represented
  const cardGroups = {};
  each(auditRecordGroups, (groupedItems, groupKey) => {
    cardGroups[groupKey] = {
      ...pick(auditRecordGroups[groupKey][0], ["ownerId", "ownerName", "ownerEmail", "timestamp"]),
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
};
