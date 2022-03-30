import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { chain, each, groupBy, map, pick, values } from "lodash";
import qs from "query-string";
import React, { useState } from "react";
import apiClient from "../../../state/apiClient";
import { HISTORY_URL } from "../../../state/ducks/userManagement/constants";
import { ACTION_TITLE_MAPPIING } from "../../../state/ducks/userManagement/types";
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
const AuditItemPresenter: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  const classes = styles();
  const [isFetching, setIsFetching] = useState(false);
  const [opendrawer, setOpenDrawer] = React.useState({
    right: openHistoryPanel,
  });
  const [Items, setItems] = React.useState<any>([]);
  const [page, setPage] = useState(0);

  const closeDrawer = () => {
    setOpenDrawer({ ...opendrawer, right: false });
    closeHistoryPanel(opendrawer.right);
  };
  React.useEffect(() => {
    fetchAuditRecords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        action: ACTION_TITLE_MAPPIING.DeletedFromGroups,
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

  const getCardGroups = (response) => {
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
        ...pick(auditRecordGroups[groupKey][0], [
          "ownerId",
          "ownerName",
          "ownerEmail",
          "timestamp",
          "employeeName",
          "id",
          "nextValue",
          "userId",
        ]),
        items: map(groupedItems, (groupItem) => ({ ...groupItem.actionInfo })),
      };
    });
    // Make uniq values
    each(cardGroups, (data: any, key) => {
      cardGroups[key].groupItems = chain(data.items)
        .groupBy("action")
        .map((itemGroup, action) => {
          const items = map(itemGroup, "value");
          if (items.length === 1) {
            if (action === "AddedToGroups") {
              action = "AddedToGroup";
            } else if (action === "DeletedFromGroups") {
              action = "DeletedFromGroup";
            }
          }
          return {
            primaryText: action,
            secondayText: [
              "AddedToGroup",
              "AddedToGroups",
              "DeletedFromGroups",
              "DeletedFromGroup",
            ].includes(action) ? items.join(",") : items.join(","),
            employeeName: data.employeeName,
            includeNameAndEmail: [
              "AddedToGroup",
              "AddedToGroups",
              "DeletedFromGroups",
              "DeletedFromGroup",
            ].includes(action),
          };
        })
        .value();
    });
    return cardGroups;
  };
  const fetchAuditRecords = () => {
     call?.cancel();
     call = axios.CancelToken.source();
     setIsFetching(true);
     const requestConfig: AxiosRequestConfig = {
       method: "get",
       url: HISTORY_URL,
       params: { offset: page, limit: 2 },
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
         setItems((prevState) => [
           ...prevState,
           ...values(cardGroups),
         ]);
         setPage((prevPageNumber) => prevPageNumber + 1);
         setIsFetching(false);
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
      <Box className={classes.listItemContainer} style={{ overflow: "auto" }}>
        {map(Items, (auditDetails, groupKey) =>
          <ListItem key={groupKey} disableGutters>
            {<Default auditDetails={auditDetails} />}
          </ListItem>
        )}
      </Box>
    </>
  );
  return (
    <Drawer anchor="right" open={opendrawer.right} onClose={() => closeDrawer()}>
      <Box width={300}> {isFetching ? <LinearProgress /> : renderAuditRecords()}</Box>
      <LoadMoreButton onLoadMore={fetchAuditRecords}  id="myHistoryLoadMore" />
    </Drawer>
  );
};

export default AuditItemPresenter;
