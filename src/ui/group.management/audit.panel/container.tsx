import { each, groupBy, map, pick, sortBy, uniq, without } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ACTION_TITLE_MAPPING, GMAuditGroupProps, GMAuditProps, UM_AUDIT_CONCAT_KEYS } from "../../../state/ducks/userManagement/types";
import Colors from "../../layout/theme/utils/colors";
import AuditItemPresenter from "./presenter";

interface TranslatedTextProps {
  [employeeName: string]: string;
}

interface Props {
  openHistoryPanel: boolean;
  closeHistoryPanel: () => void;
}

const AuditItemsContainer: React.FunctionComponent<Props> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  const intl = useIntl();
  const getTranslatedText = (key: string, values: TranslatedTextProps) =>
    intl.formatMessage({ id: `group.management.audit.history.${key}` }, values);

  const groups = useSelector(userManagementSelectors.groupsById);
  const getGroupName = (groupIds: string[]) => {
    const groupNames = uniq(map(groupIds, (groupId) => groups[groupId] ? groups[groupId].name : ""));
    return groupNames.join(", ");
  };

  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);


  const addUpdatedGroupName = (sameGroup, companyGroupName) => {
    const auditTypes = map(sameGroup, "auditType");
    if (
      !auditTypes.includes(ACTION_TITLE_MAPPING.GroupNameUpdated) &&
        !auditTypes.includes(ACTION_TITLE_MAPPING.AddedGroup)
    ) {
      sameGroup.unshift({
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.UpdatedGroups, {}),
        secondaryText: companyGroupName || "N/A",
        sortedIndex: 1,
      });
    }
    return sortBy(sameGroup, "sortedIndex");
  };

  const createGroups = (
    groupedItems: GMAuditGroupProps[],
    companyGroupName: string
  ) => {
    const similarGroups = groupBy(groupedItems, "primaryText");
    let sameGroup = map(similarGroups, (items, key) => {
      const auditType = items[0].auditType;
      const sortedIndex =  map(items, "sortedIndex")[0] || 0;
      let primaryText = key;
      const secondaryText =  uniq(map(items, "secondaryText"));
      if (auditType === ACTION_TITLE_MAPPING.AddedToGroups && secondaryText.length <= 1) {
        primaryText = getTranslatedText(ACTION_TITLE_MAPPING.AddedToGroup, {});
      }
      if (auditType === ACTION_TITLE_MAPPING.DeletedFromGroups && secondaryText.length <= 1) {
        primaryText = getTranslatedText(ACTION_TITLE_MAPPING.DeletedFromGroup, {});
      }
      if (auditType === ACTION_TITLE_MAPPING.EmployeesAddedToGroups && secondaryText.length <= 1) {
        primaryText = primaryText.replace(
          getTranslatedText(ACTION_TITLE_MAPPING.EmployeesAddedToGroups, { groupName: "" }),
          getTranslatedText(ACTION_TITLE_MAPPING.EmployeesAddedToGroup, { groupName: "" })
        );
      }
      if (auditType === ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups && secondaryText.length <= 1) {
        primaryText = primaryText.replace(
          getTranslatedText(ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups, { groupName: "" }),
          getTranslatedText(ACTION_TITLE_MAPPING.EmployeesDeleteFromGroup, { groupName: "" })
        );
      }
      // UpdatedGroup
      if (auditType === ACTION_TITLE_MAPPING.UpdatedGroups && secondaryText.length <= 1) {
        primaryText = primaryText.replace(
          getTranslatedText(ACTION_TITLE_MAPPING.UpdatedGroups, { groupName: "" }),
          getTranslatedText(ACTION_TITLE_MAPPING.UpdatedGroup, { groupName: "" })
        );
      }
      // Added Members
      if (auditType === ACTION_TITLE_MAPPING.AddedMembers && secondaryText.length <= 1) {
        primaryText = primaryText.replace(
          getTranslatedText(ACTION_TITLE_MAPPING.AddedMembers, { groupName: "" }),
          getTranslatedText(ACTION_TITLE_MAPPING.AddedMember, { groupName: "" })
        );
      }

      // Remove members
      if (auditType === ACTION_TITLE_MAPPING.RemovedMembers && secondaryText.length <= 1) {
        primaryText = primaryText.replace(
          getTranslatedText(ACTION_TITLE_MAPPING.RemovedMembers, { groupName: "" }),
          getTranslatedText(ACTION_TITLE_MAPPING.RemovedMember, { groupName: "" })
        );
      }
      let secondaryTextHtml = <span>{without(secondaryText, undefined, "").length ?
        secondaryText.join(", ") : "N/A"}</span>;
      let primaryTextHtml = <span>{primaryText}</span>;
      if (auditType === ACTION_TITLE_MAPPING.GroupNameUpdated) {
        const items = secondaryText[0].split("-NAME-UP-DATED-TO-");
        secondaryTextHtml = (
          <>
            <span>{items[0]}</span>
            <span style={{ color: Colors.font_gray, padding: "0 2px" }}>
              to
            </span>
            <span>{items[1]}</span>
          </>
        );
      } else if (
        auditType === ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups ||
        auditType === ACTION_TITLE_MAPPING.EmployeesDeleteFromGroup
      ) {
        const items = primaryText.split(UM_AUDIT_CONCAT_KEYS.DeleteFromGroup);
        primaryTextHtml = (
          <>
            <span>{items[0]}</span>
            <span
              style={{
                color: Colors.almost_black,
                padding: "0 2px",
                fontWeight: 700,
              }}
            >
              {items[1]}
            </span>
          </>
        );
      } else if (
        auditType === ACTION_TITLE_MAPPING.EmployeesAddedToGroups ||
        auditType === ACTION_TITLE_MAPPING.EmployeesAddedToGroup
      ) {
        const items = primaryText.split(UM_AUDIT_CONCAT_KEYS.AddToGroup);
        primaryTextHtml = (
          <>
            <span>{items[0]}</span>
            <span style={{ color: Colors.almost_black, padding: "0 2px", fontWeight: 700 }} > {items[1]} </span>
          </>
        );
      }
      return { primaryText: primaryTextHtml, secondaryText: secondaryTextHtml, sortedIndex, auditType };
    });
    sameGroup = sortBy(sameGroup, "sortedIndex");
    return addUpdatedGroupName(sameGroup, companyGroupName);
  };

  const parseStringArray = (value: string) => {
    let addedPermissions = "";
    try {
      addedPermissions = (JSON.parse(value) as string[]).join(", ");
    } catch (error) {
      addedPermissions = value;
    }
    return addedPermissions;
  };

  const getDescription = (auditRecord: GMAuditProps, employeeDetails) => {
    let actionInfo = {
      primaryText: ACTION_TITLE_MAPPING.Unknown as string,
      secondaryText: auditRecord.id,
      auditType: ACTION_TITLE_MAPPING.Unknown,
      sortedIndex: 0,
    };
    if (auditRecord.fieldPath === "name") {
      if (auditRecord.type === "STRING_EDITED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.GroupNameUpdated, {}),
          secondaryText: `${auditRecord.previousValue}-NAME-UP-DATED-TO-${auditRecord.nextValue}`,
          auditType: ACTION_TITLE_MAPPING.GroupNameUpdated,
          sortedIndex: 2,
        };
      } else if (auditRecord.type === "STRING_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedGroup, {}),
          secondaryText: auditRecord.nextValue,
          auditType: ACTION_TITLE_MAPPING.AddedGroup,
          sortedIndex: 2,
        };
      }
    }
    if (auditRecord.fieldPath === "employees") {
      if (auditRecord.type === "ARRAY_NEW") {
        const addedMember = getUserDetails(auditRecord.nextValue) || { user: { name: "", email: "" } };
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedMembers, {}),
          secondaryText: addedMember.user?.name || "",
          auditType: ACTION_TITLE_MAPPING.AddedMembers,
          sortedIndex: 3,
        };
      }
      else if (auditRecord.type === "ARRAY_DELETED") {
        const removedMember = getUserDetails(auditRecord.previousValue) || { user: { name: "", email: "" } };
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.RemovedMembers, {}),
          secondaryText: removedMember.user?.name || "",
          auditType: ACTION_TITLE_MAPPING.RemovedMembers,
          sortedIndex: 3,
        };
      }
    }
    if (auditRecord.fieldPath === "permissions") {
      if (auditRecord.type === "ARRAY_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedPermissions, {}),
          secondaryText: parseStringArray(auditRecord.nextValue),
          auditType: ACTION_TITLE_MAPPING.AddedPermissions,
          sortedIndex: 4,
        };
      }
      else if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.RemovedPermissions, {}),
          secondaryText: auditRecord.previousValue,
          auditType: ACTION_TITLE_MAPPING.RemovedPermissions,
          sortedIndex: 4,
        };
      }
    }
    if (auditRecord.fieldPath === "tags") {
      if (auditRecord.type === "ARRAY_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedTags, {}),
          secondaryText: parseStringArray(auditRecord.nextValue),
          auditType: ACTION_TITLE_MAPPING.AddedTags,
          sortedIndex: 5,
        };
      }
      else if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.RemovedTags, {}),
          secondaryText: auditRecord.previousValue,
          auditType: ACTION_TITLE_MAPPING.RemovedTags,
          sortedIndex: 5,
        };
      }
    }
    if (auditRecord.fieldPath === "parents") {
      if (auditRecord.type === "ARRAY_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedParentGroups, {}),
          secondaryText: getGroupName([auditRecord.nextValue]),
          auditType: ACTION_TITLE_MAPPING.AddedParentGroups,
          sortedIndex: 6,
        };
      }
      else if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.RemovedParentGroups, {}),
          secondaryText: getGroupName([auditRecord.previousValue]),
          auditType: ACTION_TITLE_MAPPING.RemovedParentGroups,
          sortedIndex: 6,
        };
      }
    }
    return actionInfo;
  };

  const getCardGroups = (response: GMAuditProps[]) => {
    const auditRecords = map(response, (auditRecord) => {
      const {
        employeeId,
        employeeName,
        ownerId,
        ownerName,
        ownerEmail,
        groupId,
        timestamp,
        companyId,
        companyGroupId,
      } = auditRecord;
      const employeeDetails = getUserDetails(employeeId) || { user: { name: employeeName, email: "" } };
      const ownerDetails = getUserDetails(ownerId) || { user: { name: ownerName, email: ownerEmail } };
      return {
        ...auditRecord,
        groupKey: `${groupId}-${ownerId}`,
        ownerDetails,
        employeeDetails,
        companyId,
        companyGroupId,
        timestamp: `${getFormattedDateString(timestamp, MomentFormats.BriefDateTime)}`,
        ...getDescription(auditRecord, employeeDetails),
      };
    });
    // Create a Group Data for each Card to be represented
    const auditRecordGroups = groupBy(auditRecords, "groupKey");
    const cardGroups = {};
    each(auditRecordGroups, (groupedItems, groupKey) => {
      const companyGroupIds = map(auditRecordGroups[groupKey], "companyGroupId");
      cardGroups[groupKey] = {
        ...pick(auditRecordGroups[groupKey][0], [
          "timestamp",
          "groupId",
          "ownerDetails",
          "companyId",
        ]),
        descriptions: createGroups(
          groupedItems as GMAuditGroupProps[],
          getGroupName(companyGroupIds)
        ),
      };
    });
    return cardGroups;
  };

  return (
    <AuditItemPresenter
      openHistoryPanel={openHistoryPanel}
      closeHistoryPanel={closeHistoryPanel}
      getCardGroups={getCardGroups}
    />
  );
};

export default AuditItemsContainer;
