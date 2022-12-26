import { each, groupBy, map, pick, sortBy } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { User } from "../../../state/ducks/common/types";
import { companySelectors } from "../../../state/ducks/company";
import { Employee } from "../../../state/ducks/company/types";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ACTION_TITLE_MAPPING, UMAuditGroupProps, UMAuditProps, UM_AUDIT_CONCAT_KEYS } from "../../../state/ducks/userManagement/types";
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
    intl.formatMessage({ id: `user.management.audit.history.${key}` }, values);

  const groups = useSelector(userManagementSelectors.groupsById);
  const getGroupName = (groupId) => groups[groupId] ? groups[groupId].name : "";

  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);
  const getUserDetailsByUserId = (userId: string) => allEmployees.find((obj) => obj?.user?.id === userId);

  const addUserNameAndEmailBlock = (sameGroup, employeeDetails) => {
    const auditTypes = map(sameGroup, "auditType");
    if (
      auditTypes.includes(ACTION_TITLE_MAPPING.AddedToGroups) ||
      auditTypes.includes(ACTION_TITLE_MAPPING.AddedToGroup)
    ) {
      sameGroup.unshift({
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedUserEmail, {}),
        secondaryText: employeeDetails.user.email,
        sortedIndex: 2,
      });
      if (!auditTypes.includes(ACTION_TITLE_MAPPING.CreatedNewUser)) {
        sameGroup.unshift({
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedUserName, {}),
          secondaryText: employeeDetails.user.name,
          sortedIndex: 1,
        });
      }
    }
    if (auditTypes.includes(ACTION_TITLE_MAPPING.ResetPassword)) {
      sameGroup.unshift({
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ForUser, {}),
        secondaryText: employeeDetails.user.name,
        sortedIndex: 2,
      });
    }
    if (auditTypes.includes(ACTION_TITLE_MAPPING.ResentPassword)) {
      sameGroup.unshift({
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ForUser, {}),
        secondaryText: employeeDetails.user.name,
        sortedIndex: 2,
      });
    }
    return sortBy(sameGroup, "sortedIndex");
  };

  const getDescription = (
    auditRecord: UMAuditProps,
    employeeDetails: Employee | { user: Partial<User> }
  ) => {
    let actionInfo = {
      primaryText: ACTION_TITLE_MAPPING.Unknown as string,
      secondaryText: auditRecord.id,
      auditType: ACTION_TITLE_MAPPING.Unknown,
      sortedIndex: 0,
    };
    if (auditRecord.fieldPath === "employees") {
      const groupName = getGroupName(
        auditRecord.nextValue === "undefined"
          ? auditRecord.previousValue
          : auditRecord.nextValue
      );
      if (auditRecord.type === "ARRAY_NEW") {
        actionInfo = {
          primaryText: `${getTranslatedText(
            ACTION_TITLE_MAPPING.EmployeesAddedToGroups,
            { groupName: "" }
          )}${UM_AUDIT_CONCAT_KEYS.AddToGroup}${groupName}`,
          secondaryText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPING.EmployeesAddedToGroups,
          sortedIndex: 3,
        };
      } else if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: `${getTranslatedText(
            ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups,
            { groupName: "" }
          )}${UM_AUDIT_CONCAT_KEYS.DeleteFromGroup}${groupName}`,
          secondaryText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups,
          sortedIndex: 3,
        };
      }
    } else if (
      auditRecord.fieldPath === "resendConfirmationEmailTimestamp" &&
      auditRecord.type === "OBJECT_EDITED"
    ) {
      actionInfo = {
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ResentPassword, {}),
        secondaryText: getTranslatedText(
          ACTION_TITLE_MAPPING.ResentPasswordDescription,
          {}
        ),
        auditType: ACTION_TITLE_MAPPING.ResentPassword,
        sortedIndex: 0,
      };
    } else if (
      auditRecord.fieldPath === "resetPasswordEmailTimestamp" &&
      auditRecord.type === "OBJECT_EDITED"
    ) {
      actionInfo = {
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ResetPassword, {}),
        secondaryText: getTranslatedText(
          ACTION_TITLE_MAPPING.ResetPasswordDescription,
          {}
        ),
        auditType: ACTION_TITLE_MAPPING.ResetPassword,
        sortedIndex: 0,
      };
    } else if (auditRecord.fieldPath === "name") {
      if (auditRecord.type === "STRING_EDITED") {
        actionInfo = {
          primaryText: getTranslatedText(
            ACTION_TITLE_MAPPING.EmployeeNameUpdated,
            {}
          ),
          secondaryText: `${auditRecord.previousValue}${UM_AUDIT_CONCAT_KEYS.NameSeparator}${auditRecord.nextValue}`,
          auditType: ACTION_TITLE_MAPPING.EmployeeNameUpdated,
          sortedIndex: 0,
        };
      } else if (auditRecord.type === "STRING_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ActivateUser, {
            employeeName: auditRecord.nextValue,
          }),
          secondaryText: intl.formatMessage({ id: "common.active" }),
          auditType: ACTION_TITLE_MAPPING.ActivateUser,
          sortedIndex: 4,
        };
      }
    }  else if (auditRecord.fieldPath === "avatar") {
      if (auditRecord.type === "STRING_EDITED") {
        actionInfo = {
          primaryText: "",
          secondaryText: `${getTranslatedText(ACTION_TITLE_MAPPING.UpdatedAvatar, {
            employeeName: "",
          })}${UM_AUDIT_CONCAT_KEYS.AvatarUpdated}${auditRecord.employeeName}`,
          auditType: ACTION_TITLE_MAPPING.UpdatedAvatar,
          sortedIndex: 4,
        };
      }
    } else if (auditRecord.fieldPath === "groups") {
      if (auditRecord.type === "ARRAY_NEW") {
        if (auditRecord.previousValue === "undefined") {
          actionInfo = {
            primaryText: getTranslatedText(
              ACTION_TITLE_MAPPING.AddedToGroups,
              {}
            ),
            secondaryText: getGroupName(auditRecord.nextValue),
            auditType: ACTION_TITLE_MAPPING.AddedToGroups,
            sortedIndex: 3,
          };
        }
      } else if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: getTranslatedText(
            ACTION_TITLE_MAPPING.DeletedFromGroups,
            {}
          ),
          secondaryText: getGroupName(auditRecord.previousValue),
          auditType: ACTION_TITLE_MAPPING.DeletedFromGroups,
          sortedIndex: 3,
        };
      }
    } else if (auditRecord.fieldPath === "active") {
      if (auditRecord.type === "BOOLEAN_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(
            ACTION_TITLE_MAPPING.CreatedNewUser,
            {}
          ),
          secondaryText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPING.CreatedNewUser,
          sortedIndex: 0,
        };
      } else if (auditRecord.type === "BOOLEAN_EDITED") {
        if (
          auditRecord.previousValue === "true" &&
          auditRecord.nextValue === "false"
        ) {
          actionInfo = {
            primaryText: getTranslatedText(
              ACTION_TITLE_MAPPING.DeactivateUser,
              {}
            ),
            secondaryText: auditRecord.employeeName,
            auditType: ACTION_TITLE_MAPPING.DeactivateUser,
            sortedIndex: 0,
          };
        }
        if (
          auditRecord.previousValue === "false" &&
          auditRecord.nextValue === "true"
        ) {
          actionInfo = {
            primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ReactivateUser, {
              employeeName: employeeDetails?.user?.name || "",
            }),
            secondaryText: auditRecord.employeeName,
            auditType: ACTION_TITLE_MAPPING.ReactivateUser,
            sortedIndex: 0,
          };
        }
      }
    }
    return actionInfo;
  };

  const createGroups = (groupedItems: UMAuditGroupProps[], employeeDetails: Partial<Employee>) => {
    const similarGroups = groupBy(groupedItems, "primaryText");
    const sameGroup = map(similarGroups, (items, key) => {
      const auditType = items[0].auditType;
      let sortedIndex = 0;
      let primaryText = key;
      const secondaryText = map(items, "secondaryText");
      if (auditType === ACTION_TITLE_MAPPING.ActivateUser || auditType === ACTION_TITLE_MAPPING.AddedToGroups
        || auditType === ACTION_TITLE_MAPPING.DeletedFromGroups) {
        sortedIndex = items[0].sortedIndex;
      }
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
      let secondaryTextHtml = <span>{secondaryText.join(", ")}</span>;
      let primaryTextHtml = <span>{primaryText}</span>;
      if (auditType === ACTION_TITLE_MAPPING.EmployeeNameUpdated) {
        const items = secondaryText[0].split(UM_AUDIT_CONCAT_KEYS.NameSeparator);
        secondaryTextHtml = (
          <>
            <span>{items[0]}</span>
            <span style={{ color: Colors.font_gray, padding: "0 2px" }}>
              to
            </span>
            <span>{items[1]}</span>
          </>
        );
      } else if (auditType === ACTION_TITLE_MAPPING.UpdatedAvatar) {
        const items = secondaryText[0].split(UM_AUDIT_CONCAT_KEYS.AvatarUpdated);
        secondaryTextHtml = (
          <>
            <span style={{ fontSize: "12px",  color: Colors.font_gray }}>{items[0]}</span>
            <span style={{
              color: Colors.almost_black,
              padding: "0 2px",
              fontSize: "14px",
            }}>{items[1]}</span>
          </>
        );
      } else if (
        auditType === ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups ||
        auditType === ACTION_TITLE_MAPPING.EmployeesDeleteFromGroup
      ) {
        const items = primaryText.split(UM_AUDIT_CONCAT_KEYS.DeleteFromGroup);
        primaryTextHtml = (
          <>
            {getTranslatedText(ACTION_TITLE_MAPPING.Removed, {})} <span style={{
              color: Colors.almost_black,
              padding: "0 2px",
              fontSize: "14px",
            }}> {secondaryTextHtml}</span>
            <span>{items[0]}</span>
            <span
              style={{
                color: Colors.almost_black,
                padding: "0 2px",
                fontSize: "14px",
              }}
            >
              {items[1]}
            </span>
          </>
        );
        secondaryTextHtml = (<></>);
      } else if (
        auditType === ACTION_TITLE_MAPPING.EmployeesAddedToGroups ||
        auditType === ACTION_TITLE_MAPPING.EmployeesAddedToGroup
      ) {
        const items = primaryText.split(UM_AUDIT_CONCAT_KEYS.AddToGroup);
        primaryTextHtml = (
          <>
            {getTranslatedText(ACTION_TITLE_MAPPING.Added, {})} <span style={{
              color: Colors.almost_black,
              padding: "0 2px",
              fontSize: "14px",
            }}> {secondaryTextHtml}</span>
            <span>{items[0]}</span>
            <span style={{ color: Colors.almost_black, padding: "0 2px", fontSize: "14px" }} > {items[1]} </span>
          </>
        );
        secondaryTextHtml = (<></>);
      }
      return { primaryText: primaryTextHtml, secondaryText: secondaryTextHtml, sortedIndex, auditType };
    });
    return addUserNameAndEmailBlock(sameGroup, employeeDetails);
  };

  const getCardGroups = (auditData: UMAuditProps[]) => {
    const auditRecords = map(auditData, (auditRecord: UMAuditProps) => {
      const { employeeId, employeeName, ownerId, ownerEmail, groupId, timestamp, userId } = auditRecord;
      const employeeDetails = getUserDetails(employeeId) ||
        getUserDetailsByUserId(userId) || {
        user: { name: employeeName, email: "" },
      };
      const ownerDetails = getUserDetails(ownerId) || {
        user: {
          name: intl.formatMessage({ id: "common.server.automation" }),
          email: ownerEmail,
        },
      };
      return {
        ...auditRecord,
        groupKey: `${groupId}-${ownerId}`,
        ownerDetails,
        employeeDetails,
        timestamp: `${getFormattedDateString(timestamp, MomentFormats.BriefDateTime)}`,
        ...getDescription(auditRecord, employeeDetails),
      };
    });
    // Create a Group Data for each Card to be represented
    const auditRecordGroups = groupBy(auditRecords, "groupKey");
    const cardGroups = {};
    each(auditRecordGroups, (groupedItems, groupKey) => {
      cardGroups[groupKey] = {
        ...pick(auditRecordGroups[groupKey][0], ["timestamp", "groupId", "ownerDetails"]),
        descriptions: createGroups(
          groupedItems as UMAuditGroupProps[],
          auditRecordGroups[groupKey][0].employeeDetails as Partial<Employee>
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
