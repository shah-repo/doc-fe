import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { each, groupBy, isEmpty, map, pick, sortBy, values } from "lodash";
import qs from "query-string";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import apiClient from "../../../state/apiClient";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { UM_AUDIT_HISTORY_INITIAL_OFFSET, UM_AUDIT_HISTORY_LIMIT, UM_AUDIT_URL } from "../../../state/ducks/userManagement/constants";
import { ACTION_TITLE_MAPPING, AuditDetailsProps } from "../../../state/ducks/userManagement/types";
import { store } from "../../../state/store";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import Default from "./Cards/Default";
import { LoadMoreButton } from "./LoadMoreButton";
import styles from "./styles";

let call: CancelTokenSource;
interface OwnProps {
  openHistoryPanel: boolean;
  closeHistoryPanel: (panel: boolean) => void;
}

interface TranslatedTextProps {
  [employeeName: string]: string;
}

const AuditItemPresenter: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  // Take from constants
  const limit = UM_AUDIT_HISTORY_LIMIT;
  const classes = styles();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDrawer, setOpenDrawer] = React.useState({ right: openHistoryPanel });
  const [Items, setItems] = React.useState<AuditDetailsProps[]>([]);
  const [page, setPage] = useState(UM_AUDIT_HISTORY_INITIAL_OFFSET);
  const groups = useSelector(userManagementSelectors.groupsById);
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const intl = useIntl();

  const getTranslatedText = (key: string, values: TranslatedTextProps) =>
    intl.formatMessage({ id: `user.management.audit.history.${key}` }, values);
  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);
  const getGroupName = (groupId) => groups[groupId] ? groups[groupId].name : "";
  const closeDrawer = () => {
    setOpenDrawer({ ...openDrawer, right: false });
    closeHistoryPanel(openDrawer.right);
  };

  React.useEffect(() => {
    fetchAuditRecords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDescription = (auditRecord, ownerDetails, employeeDetails) => {
    let actionInfo = {
      primaryText: ACTION_TITLE_MAPPING.Unknown as string,
      secondaryText: auditRecord.id,
      auditType: ACTION_TITLE_MAPPING.Unknown,
      sortedIndex: 0,
    };
    if (auditRecord.fieldPath === "employees") {
      const groupName = getGroupName(
        auditRecord.nextValue === "undefined" ? auditRecord.previousValue : auditRecord.nextValue
      );
      if (auditRecord.type === "ARRAY_NEW") {
        actionInfo = {
          primaryText: `${getTranslatedText(ACTION_TITLE_MAPPING.EmployeesAddedToGroups, { groupName: "" })}-ADDED-TO-GROUP-${groupName}`,
          secondaryText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPING.EmployeesAddedToGroups,
          sortedIndex: 3,
        };
      } else if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: `${getTranslatedText(ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups, { groupName: "" })}-DELETED-FROM-GROUP-${groupName}`,
          secondaryText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPING.EmployeesDeleteFromGroups,
          sortedIndex: 3,
        };
      }
    } else if (
      ["resetPasswordEmailTimestamp", "resendConfirmationEmailTimestamp"].includes(auditRecord.fieldPath) &&
      auditRecord.type === "OBJECT_EDITED") {
      actionInfo = {
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ResetPassword, {}),
        secondaryText: getTranslatedText(ACTION_TITLE_MAPPING.ResetPasswordDescription, {}),
        auditType: ACTION_TITLE_MAPPING.ResetPassword,
        sortedIndex: 0,
      };
    } else if (auditRecord.fieldPath === "name") {
      if (auditRecord.type === "STRING_EDITED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.EmployeeNameUpdated, {}),
          secondaryText: `${auditRecord.previousValue}-NAME-UP-DATED-TO-${auditRecord.nextValue}`,
          auditType: ACTION_TITLE_MAPPING.EmployeeNameUpdated,
          sortedIndex: 0,
        };
      } else if (auditRecord.type === "STRING_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ActivateUser, { employeeName: auditRecord.nextValue }),
          secondaryText: intl.formatMessage({ id: "common.active" }),
          auditType: ACTION_TITLE_MAPPING.ActivateUser,
          sortedIndex: 1,
        };
      }
    } else if (auditRecord.fieldPath === "groups") {
      if (auditRecord.type === "ARRAY_NEW") {
        if (auditRecord.previousValue === "undefined") {
          actionInfo = {
            primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedToGroups, {}),
            secondaryText: getGroupName(auditRecord.nextValue),
            auditType: ACTION_TITLE_MAPPING.AddedToGroups,
            sortedIndex: 3,
          };
        }
      } else if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.DeletedFromGroups, {}),
          secondaryText: getGroupName(auditRecord.previousValue),
          auditType: ACTION_TITLE_MAPPING.DeletedFromGroups,
          sortedIndex: 3,
        };
      }
    } else if (auditRecord.fieldPath === "active") {
      if (auditRecord.type === "BOOLEAN_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.CreatedNewUser, {}),
          secondaryText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPING.CreatedNewUser,
          sortedIndex: 0,
        };
      } else if (auditRecord.type === "BOOLEAN_EDITED") {
        if (auditRecord.previousValue === "true" && auditRecord.nextValue === "false") {
          actionInfo = {
            primaryText: getTranslatedText(ACTION_TITLE_MAPPING.DeactivateUser, {}),
            secondaryText: auditRecord.employeeName,
            auditType: ACTION_TITLE_MAPPING.DeactivateUser,
            sortedIndex: 0,
          };
        }
        if (auditRecord.previousValue === "false" && auditRecord.nextValue === "true") {
          actionInfo = {
            primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ActivateUser, {
              employeeName: employeeDetails?.user?.name,
            }),
            secondaryText:
              auditRecord.nextValue === "true"
                ? intl.formatMessage({ id: "common.active" })
                : intl.formatMessage({ id: "common.inactive" }),
            auditType: ACTION_TITLE_MAPPING.ActivateUser,
            sortedIndex: 0,
          };
        }
      }
    }
    return actionInfo;
  };

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
        primaryText: getTranslatedText(ACTION_TITLE_MAPPING.ResetPasswordFor, {}),
        secondaryText: employeeDetails.user.name,
        sortedIndex: 2,
      });
    }
    return sortBy(sameGroup, "sortedIndex");
  };

  const createGroups = (groupedItems, employeeDetails) => {
    const similarGroups = groupBy(groupedItems, "primaryText");
    const sameGroup = map(similarGroups, (items, key) => {
      const auditType = items[0].auditType;
      let sortedIndex = 0;
      let primaryText = key;
      const secondaryText = map(items, "secondaryText");
      if (auditType === ACTION_TITLE_MAPPING.AddedToGroups || auditType === ACTION_TITLE_MAPPING.DeletedFromGroups) {
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
        const items = primaryText.split("-DELETED-FROM-GROUP-");
        primaryTextHtml = (
          <>
            <span>{items[0]}</span>
            <span
              style={{
                color: Colors.font_black,
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
        const items = primaryText.split("-ADDED-TO-GROUP-");
        primaryTextHtml = (
          <>
            <span>{items[0]}</span>
            <span style={{ color: Colors.font_black, padding: "0 2px", fontWeight: 700 }} > {items[1]} </span>
          </>
        );
      }
      return { primaryText: primaryTextHtml, secondaryText: secondaryTextHtml, sortedIndex, auditType };
      // return { primaryText, secondaryText: uniq(secondaryText).sort().join(", "), sortedIndex, auditType };
    });
    return addUserNameAndEmailBlock(sameGroup, employeeDetails);
  };

  const getCardGroups = (response) => {
    const auditRecords = map(response, (auditRecord) => {
      const { employeeId, employeeName, ownerId, ownerName, ownerEmail, groupId, timestamp } = auditRecord;
      const employeeDetails = getUserDetails(employeeId) || { user: { name: employeeName, email: "" } };
      const ownerDetails = getUserDetails(ownerId) || { user: { name: ownerName, email: ownerEmail } };
      return {
        ...auditRecord,
        groupKey: `${groupId}-${timestamp}-${ownerId}`,
        ownerDetails,
        employeeDetails,
        timestamp: `${getFormattedDateString(timestamp, MomentFormats.BriefDateTime)}`,
        ...getDescription(auditRecord, ownerDetails, employeeDetails),
      };
    });
    // Create a Group Data for each Card to be represented
    const auditRecordGroups = groupBy(auditRecords, "groupKey");
    const cardGroups = {};
    each(auditRecordGroups, (groupedItems, groupKey) => {
      cardGroups[groupKey] = {
        ...pick(auditRecordGroups[groupKey][0], ["timestamp", "groupId", "ownerDetails", "employeeDetails"]),
        descriptions: createGroups(groupedItems, auditRecordGroups[groupKey][0].employeeDetails),
      };
    });
    return cardGroups;
  };

  const fetchAuditRecords = () => {
     call?.cancel();
     call = axios.CancelToken.source();
     setIsLoading(true);
     setErrorMessage("");
     const requestConfig: AxiosRequestConfig = {
       method: "get",
       url: UM_AUDIT_URL,
       params: { offset: page, limit },
       paramsSerializer: (params) => qs.stringify(params),
       headers: {
         Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
       },
       cancelToken: call.token,
     };
     apiClient
       .request(requestConfig)
       .then((resp) => resp)
       .then(({ data }) => {
         const cardGroups = getCardGroups(data.results || []);
         setItems((prevState: AuditDetailsProps[]) => [
           ...prevState,
           ...values(cardGroups),
         ] as AuditDetailsProps[]);
         setPage((prevPageNumber) => prevPageNumber + limit);
         setIsLoading(false);
       })
       .catch((exception) => {
         setIsLoading(false);
         if (axios.isCancel(exception)) {
           return;
         }
         if (exception?.response?.status === 504) {
           setErrorMessage(intl.formatMessage({ id: "api.error.gateway.timeout" }));
         }
       });
  };

  const renderAuditRecords = () => (
    <>
      <div className={classes.externalContainer}>
        <div className={classes.titleOuterContainer}>
          <div className={classes.titleContainer}>
            <Text translation="document.revision.history" />
          </div>
          <div className={classes.iconContainer} >
            <IconButton
              color="default"
              onClick={() => closeDrawer()}
              aria-label="Close"
              disableFocusRipple
              disableRipple
              disableTouchRipple
            >
              <CloseIcon style={{ color: Colors.gray }} />
            </IconButton>
          </div>
        </div>
      </div>
      <Box className={classes.listItemContainer}>
        {map(Items, (auditDetails, groupKey) => (
          <ListItem key={groupKey} disableGutters style={{ padding: 0 }}>
            {<Default auditDetails={auditDetails} />}
          </ListItem>)

        )}
      </Box>
    </>
  );
  return (
    <Drawer anchor="right" open={openDrawer.right} onClose={() => closeDrawer()}>
      {isLoading && <LinearProgress />}
      <Box width={300}>{renderAuditRecords()}</Box>
      {!isEmpty(errorMessage) && <div style={{ color: "red" }}>{errorMessage}</div>}
      {!isLoading && <LoadMoreButton onLoadMore={fetchAuditRecords}  id="historyLoadMore" />}
    </Drawer>
  );
};

export default AuditItemPresenter;
