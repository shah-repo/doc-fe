import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { each, groupBy, map, pick, sortBy, values } from "lodash";
import qs from "query-string";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import apiClient from "../../../state/apiClient";
import { NullableArray } from "../../../state/ducks/common/types";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { HISTORY_URL } from "../../../state/ducks/userManagement/constants";
import { ACTION_TITLE_MAPPIING, AuditDetailsProps } from "../../../state/ducks/userManagement/types";
import { store } from "../../../state/store";
import Text from "../../components/Text";
import { LoadMoreButton } from "../../dashboard.new/LoadMoreButton";
import Colors from "../../layout/theme/utils/colors";
import Default from "./Cards/Default";
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
  const limit = 5;
  const classes = styles();
  const [isLoading, setIsLoading] = useState(false);
  const [opendrawer, setOpenDrawer] = React.useState({ right: openHistoryPanel });
  const [Items, setItems] = React.useState<NullableArray<AuditDetailsProps[]>>([]);
  const [page, setPage] = useState(0);
  const groups = useSelector(userManagementSelectors.groupsById);
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const intl = useIntl();

  const getTransalatedText = (key: string, values: TranslatedTextProps) =>  intl.formatMessage({ id: `user.management.audit.history.${key}` }, values);

  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);
  const getGroupName = (groupId) => groups[groupId] ? groups[groupId].name : groupId;
  const closeDrawer = () => {
    setOpenDrawer({ ...opendrawer, right: false });
    closeHistoryPanel(opendrawer.right);
  };

  React.useEffect(() => {
    fetchAuditRecords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDescription = (auditRecord, ownerDetails, employeeDetails) => {
    // console.log("employeeDetails :: ", employeeDetails);
    let actionInfo = {
      primaryText: ACTION_TITLE_MAPPIING.Unknown as string,
      secondayText: auditRecord.id,
      auditType: ACTION_TITLE_MAPPIING.Unknown,
      sortedIndex: 0,
    };
    if (auditRecord.fieldPath === "name" && auditRecord.type === "STRING_EDITED") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.EmployeeNameUpdated, {}),
        secondayText: `${auditRecord.previousValue} to ${auditRecord.nextValue}`,
        auditType: ACTION_TITLE_MAPPIING.EmployeeNameUpdated,
        sortedIndex: 0,
      };
    } else if (auditRecord.fieldPath === "groups" && auditRecord.type === "ARRAY_NEW") {
      if (auditRecord.previousValue === "undefined") {
        actionInfo = {
          primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.AddedToGroups, {}),
          secondayText: getGroupName(auditRecord.nextValue),
          auditType: ACTION_TITLE_MAPPIING.AddedToGroups,
          sortedIndex: 3,
        };
      }
    } else if (auditRecord.fieldPath === "groups" && auditRecord.type === "ARRAY_DELETED") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.DeletedFromGroups, {}),
        secondayText: getGroupName(auditRecord.previousValue),
        auditType: ACTION_TITLE_MAPPIING.DeletedFromGroups,
        sortedIndex: 3,
      };
    } else if (auditRecord.fieldPath === "active" && auditRecord.type === "BOOLEAN_NEW") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.CreatedNewUser, {}),
        secondayText: auditRecord.employeeName,
        auditType: ACTION_TITLE_MAPPIING.CreatedNewUser,
        sortedIndex: 0,
      };
    } else if (auditRecord.fieldPath === "name" && auditRecord.type === "STRING_NEW") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.ActivateUser, { employeeName: auditRecord.nextValue }),
        secondayText: "Active",
        auditType: ACTION_TITLE_MAPPIING.ActivateUser,
        sortedIndex: 1,
      };
    }
    else if (auditRecord.fieldPath === "active" && auditRecord.type === "BOOLEAN_EDITED") {
      if (auditRecord.previousValue === "true" && auditRecord.nextValue === "false") {
        actionInfo = {
          primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.DeactivateUser, {}),
          secondayText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPIING.DeactivateUser,
          sortedIndex: 0,
        };
      }
      if (auditRecord.previousValue === "false" && auditRecord.nextValue === "true") {
        actionInfo = {
          primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.ActivateUser, { employeeName: employeeDetails?.user?.name }),
          secondayText: auditRecord.nextValue === "true" ? "Active" : "Inactive",
          auditType: ACTION_TITLE_MAPPIING.ActivateUser,
          sortedIndex: 0,
        };
      }
    }
    return actionInfo;
  };

  const createGroups = (groupedItems) => {
    const similarGroups = groupBy(groupedItems, "primaryText");
    const sameGroup = map(similarGroups, (items, key) => {
      const auditType = items[0].auditType;
      let sortedIndex = 0;
      let primaryText = key;
      const secondayText = map(items, "secondayText");
      if (auditType === ACTION_TITLE_MAPPIING.AddedToGroups || auditType === ACTION_TITLE_MAPPIING.DeletedFromGroups) {
        sortedIndex = items[0].sortedIndex;
      }
      if (auditType === ACTION_TITLE_MAPPIING.AddedToGroups as string && secondayText.length <= 1) {
        primaryText = getTransalatedText(ACTION_TITLE_MAPPIING.AddedToGroup, {});
      }
      return { primaryText, secondayText: secondayText.join(", "), sortedIndex };
    });
    return addUserNameAndEmailBlock(sameGroup);
  };

  const getCardGroups = (response) => {
    const auditRecords = map(response, (auditRecord) => {
      const employeeDetails = getUserDetails(auditRecord.employeeId);
      const ownerDetails = getUserDetails(auditRecord.ownerId);
      return {
        ...auditRecord,
        groupKey: `${auditRecord.groupId}-${auditRecord.timestamp}-${auditRecord.ownerId}`,
        ownerDetails,
        employeeDetails,
        timestamp: `${getFormattedDateString(auditRecord.timestamp, MomentFormats.BriefDateTime)}`,
        ...getDescription(auditRecord, ownerDetails, employeeDetails),
      };
    });
    // console.log("debug :: auditRecords :: ", auditRecords);
    // Create a Group Data for each Card to be represented
    const auditRecordGroups = groupBy(auditRecords, "groupKey");
    const cardGroups = {};
    each(auditRecordGroups, (groupedItems, groupKey) => {
      cardGroups[groupKey] = {
        ...pick(auditRecordGroups[groupKey][0], [
          "timestamp",
          "id",
          "ownerDetails",
          "employeeDetails",
        ]),
        descriptions: createGroups(groupedItems),
      };
    });
    return cardGroups;
  };
  // Add Username and email
  const addUserNameAndEmailBlock = (sameGroup) => {
    const pt = sameGroup.map((d) => d.primaryText);
    if (pt.includes("Added To Groups") || pt.includes("Added To Group") || pt.includes("Removed from Groups")) {
      sameGroup.unshift({ primaryText: "Added User Email", secondayText: "Shiv@enlil.com", sortedIndex: 2  });
      if (!pt.includes("Added New User")) {
        sameGroup.unshift({ primaryText: "Added User Name", secondayText: "Shiv", sortedIndex: 1 });
      }
    }
    return sortBy(sameGroup, "sortedIndex");
  };

  const fetchAuditRecords = () => {
     call?.cancel();
     call = axios.CancelToken.source();
     setIsLoading(true);
     const requestConfig: AxiosRequestConfig = {
       method: "get",
       url: HISTORY_URL,
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
         //  TODO: Page is added for testing. Need to remove
         const cardGroups = getCardGroups(data.results || []);
         setItems((prevState: NullableArray<AuditDetailsProps[]>) => [
           ...prevState,
           ...values(cardGroups),
         ] as NullableArray<AuditDetailsProps[]>);
         setPage((prevPageNumber) => prevPageNumber + limit);
         setIsLoading(false);
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
              id="histoy-closepanel"
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
          <ListItem key={groupKey} disableGutters>
            {<Default auditDetails={auditDetails} />}
          </ListItem>)

        )}
      </Box>
    </>
  );

  return (
    <Drawer anchor="right" open={opendrawer.right} onClose={() => closeDrawer()}>
      <Box width={300}> {isLoading ? <LinearProgress /> : renderAuditRecords()}</Box>
      <LoadMoreButton onLoadMore={fetchAuditRecords}  id="historyLoadMore" />
    </Drawer>
  );
};

export default AuditItemPresenter;
