import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { each, groupBy, isEmpty, map, pick, sortBy, values, without } from "lodash";
import qs from "query-string";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import apiClient from "../../../state/apiClient";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { UM_AUDIT_HISTORY_INITIAL_OFFSET, UM_AUDIT_HISTORY_LIMIT } from "../../../state/ducks/userManagement/constants";
import { ACTION_TITLE_MAPPING, AuditDetailsProps, UM_AUDIT_CONCAT_KEYS } from "../../../state/ducks/userManagement/types";
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
  queryURL: string;
}

interface TranslatedTextProps {
  [employeeName: string]: string;
}

const AuditItemPresenter: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
  queryURL,
}) => {
  // Take from constants
  const limit = UM_AUDIT_HISTORY_LIMIT;
  const classes = styles();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDrawer, setOpenDrawer] = React.useState({ right: openHistoryPanel });
  const [Items, setItems] = React.useState<AuditDetailsProps[]>([]);
  const [page, setPage] = useState(UM_AUDIT_HISTORY_INITIAL_OFFSET);
  // const groups = useSelector(userManagementSelectors.groupsById);
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const intl = useIntl();
  const groups = useSelector(userManagementSelectors.groupsById);
  const getGroupName = (groupId) => groups[groupId] ? groups[groupId].name : "";

  const getTranslatedText = (key: string, values: TranslatedTextProps) =>
    intl.formatMessage({ id: `group.management.audit.history.${key}` }, values);
  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);
  const closeDrawer = () => {
    setOpenDrawer({ ...openDrawer, right: false });
    closeHistoryPanel(openDrawer.right);
  };

  React.useEffect(() => {
    fetchAuditRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseStringArrary = (value: string) => {
    let addedPermissions = "";
    try {
      addedPermissions = (JSON.parse(value) as string[]).join(",");
    } catch (error) {
      addedPermissions = value;
    }
    return addedPermissions;
  };

  const getDescription = (auditRecord, employeeDetails) => {
    let actionInfo = {
      primaryText: ACTION_TITLE_MAPPING.Unknown as string,
      secondaryText: auditRecord.id,
      auditType: ACTION_TITLE_MAPPING.Unknown,
      sortedIndex: 0,
    };
    if (auditRecord.fieldPath === "name") {
      if (auditRecord.type === "STRING_EDITED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.EmployeeNameUpdated, {}),
          secondaryText: `${auditRecord.previousValue}-NAME-UP-DATED-TO-${auditRecord.nextValue}`,
          auditType: ACTION_TITLE_MAPPING.EmployeeNameUpdated,
          sortedIndex: 1,
        };
      } else if (auditRecord.type === "STRING_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedGroup, {}),
          secondaryText: auditRecord.nextValue,
          auditType: ACTION_TITLE_MAPPING.AddedGroup,
          sortedIndex: 1,
        };
      }
    }
    if (auditRecord.fieldPath === "employees") {
      if (auditRecord.type === "ARRAY_NEW") {
        const addedMember = getUserDetails(auditRecord.nextValue) || { user: { name: "", email: "" } };
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedMembers, {}),
          secondaryText: addedMember.user?.name,
          auditType: ACTION_TITLE_MAPPING.AddedMembers,
          sortedIndex: 2,
        };
      }
      if (auditRecord.type === "ARRAY_DELETED") {
        const removedMember = getUserDetails(auditRecord.previousValue) || { user: { name: "", email: "" } };
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.RemovedMembers, {}),
          secondaryText: removedMember.user?.name,
          auditType: ACTION_TITLE_MAPPING.RemovedMembers,
          sortedIndex: 2,
        };
      }
    }
    if (auditRecord.fieldPath === "permissions") {
      if (auditRecord.type === "ARRAY_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedPermissions, {}),
          secondaryText: parseStringArrary(auditRecord.nextValue),
          auditType: ACTION_TITLE_MAPPING.AddedPermissions,
          sortedIndex: 3,
        };
      }
      if (auditRecord.type === "ARRAY_DELETED") {
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
          secondaryText: parseStringArrary(auditRecord.nextValue),
          auditType: ACTION_TITLE_MAPPING.AddedTags,
          sortedIndex: 4,
        };
      }
      if (auditRecord.type === "ARRAY_DELETED") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.RemovedTags, {}),
          secondaryText: auditRecord.previousValue,
          auditType: ACTION_TITLE_MAPPING.RemovedTags,
          sortedIndex: 4,
        };
      }
    }
    if (auditRecord.fieldPath === "parents") {
      if (auditRecord.type === "ARRAY_NEW") {
        actionInfo = {
          primaryText: getTranslatedText(ACTION_TITLE_MAPPING.AddedParentGroups, {}),
          secondaryText: getGroupName( auditRecord.nextValue),
          auditType: ACTION_TITLE_MAPPING.AddedParentGroups,
          sortedIndex: 4,
        };
      }
    }
    return actionInfo;
  };

  const addUserNameAndEmailBlock = (sameGroup, employeeDetails) => {
    console.log(sameGroup);
    return sortBy(sameGroup, "sortedIndex");
  };

  const createGroups = (groupedItems, employeeDetails) => {
    const similarGroups = groupBy(groupedItems, "primaryText");
    let sameGroup = map(similarGroups, (items, key) => {
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
      let secondaryTextHtml = <span>{without(secondaryText, undefined, "").length ?
        secondaryText.join(", ") : "N/A"}</span>;
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
        const items = primaryText.split(UM_AUDIT_CONCAT_KEYS.DeleteFromGroup);
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
        const items = primaryText.split(UM_AUDIT_CONCAT_KEYS.AddToGroup);
        primaryTextHtml = (
          <>
            <span>{items[0]}</span>
            <span style={{ color: Colors.font_black, padding: "0 2px", fontWeight: 700 }} > {items[1]} </span>
          </>
        );
      }
      return { primaryText: primaryTextHtml, secondaryText: secondaryTextHtml, sortedIndex, auditType };
    });
    sameGroup = sortBy(sameGroup, "sortedIndex");
    return addUserNameAndEmailBlock(sameGroup, employeeDetails);
  };

  const getCardGroups = (response) => {
    const auditRecords = map(response, (auditRecord) => {
      const { employeeId, employeeName, ownerId, ownerName, ownerEmail, groupId, timestamp, companyId } = auditRecord;
      const employeeDetails = getUserDetails(employeeId) || { user: { name: employeeName, email: "" } };
      const ownerDetails = getUserDetails(ownerId) || { user: { name: ownerName, email: ownerEmail } };
      console.log("groupKey :: ", `${groupId}-${timestamp}-${ownerId}`);
      return {
        ...auditRecord,
        groupKey: `${groupId}-${timestamp}-${ownerId}`,
        ownerDetails,
        employeeDetails,
        companyId,
        timestamp: `${getFormattedDateString(timestamp, MomentFormats.BriefDateTime)}`,
        ...getDescription(auditRecord, employeeDetails),
      };
    });
    // Create a Group Data for each Card to be represented
    const auditRecordGroups = groupBy(auditRecords, "groupKey");
    const cardGroups = {};
    each(auditRecordGroups, (groupedItems, groupKey) => {
      console.log(groupedItems);
      cardGroups[groupKey] = {
        ...pick(auditRecordGroups[groupKey][0], ["timestamp", "groupId", "ownerDetails", "companyId"]),
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
       url: queryURL,
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
