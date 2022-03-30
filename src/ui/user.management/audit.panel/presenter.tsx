import { Box, Drawer, IconButton, LinearProgress, ListItem, ListItemText } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { map } from "lodash";
import qs from "query-string";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../../state/apiClient";
import { historySelectors } from "../../../state/ducks/userManagement";
import { HISTORY_URL } from "../../../state/ducks/userManagement/constants";
import { store } from "../../../state/store";
import { AsyncStatus } from "../../../state/types";
import Text from "../../components/Text";
import { LoadMoreButton } from "../../dashboard.new/LoadMoreButton";
import Colors from "../../layout/theme/utils/colors";
// import Default from "./Cards/Default";
import styles from "./styles";

let call: CancelTokenSource;
type Anchor =  "right";
interface OwnProps {
  openHistoryPanel: boolean;
  closeHistoryPanel: (panel: boolean) => void;
  // onLoadMoreData: () => void;
}
const AuditItemPresenter: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
  // onLoadMoreData,
}) => {
  const loadAsyncState = useSelector(historySelectors.getLoadHistoryListAsyncInfo);
  const loading = ![AsyncStatus.Success, AsyncStatus.Error].includes(loadAsyncState.status);
  const classes = styles();
  const [isFetching, setIsFetching] = useState(false);
  const cardGroups: any = useSelector(historySelectors.historyGroups);
  console.log("debug: cardGroups :: ", cardGroups);
  const [opendrawer, setOpenDrawer] = React.useState({
    right: openHistoryPanel,
  });
  const [Items, setItems] = React.useState<any>([]);
  const [page, setPage] = useState(0);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    // event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    // TODO: Check if below If condition required
    // if (
    //   event.type === "keydown" &&
    //   ((event as React.KeyboardEvent).key === "Tab" ||
    //     (event as React.KeyboardEvent).key === "Shift")
    // ) {
    //   return;
    // }

    setOpenDrawer({ ...opendrawer, [anchor]: open });
    closeHistoryPanel(opendrawer.right);
  };
    // Multiple Api call - TODO: FIX
  React.useEffect(() => {
    queryApi();
  }, []);

  const queryApi = () => {
     call?.cancel();
     call = axios.CancelToken.source();
     setIsFetching(true);
     const requestConfig: AxiosRequestConfig = {
       method: "post",
       url: HISTORY_URL,
       data: { offset: page, limit: 50 },
       params: {},
       paramsSerializer: (params) => qs.stringify(params),
       headers: {},
       cancelToken: call.token,
     };
     requestConfig.headers.Authorization = `bearer ${
       store.getState().auth.user.employeeId
     }:${store.getState().auth.user.sessionId}`;

     apiClient
       .request(requestConfig)
       .then((resp) => resp)
       .then(({ data }) => {
         console.log("Data:::", data.results);
         const titleList: string[] = data.results.map((b: { id: string }) => b.id);
         setItems((prevState) => [
           ...prevState,
           ...titleList,
         ]);
         setPage((prevPageNumber) => prevPageNumber + 1);
         setIsFetching(false);
       });
  };

  const renderListItems = () => (
    <>
      <div className={classes.externalContainer}>
        <div className={classes.titleOuterContainer}>
          <div className={classes.titleContainer}>
            <Text translation="document.revision.history" />
          </div>
          <div className={classes.iconContainer} >
            <IconButton
              color="default"
              onClick={toggleDrawer("right", false)}
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
      {/* <Box className={classes.listItemContainer} style={{ overflow: "auto" }}>
        {map(cardGroups, (auditDetails, groupKey) =>
          <ListItem key={groupKey} disableGutters>
            {<Default auditDetails={auditDetails} />}
          </ListItem>
        )}
      </Box> */}
      <Box width={300}>{loading ? <LinearProgress /> : <Box className={classes.listItemContainer} style={{ overflow: "auto" }}>
        {map(Items, (auditDetails, groupKey) =>
          <ListItem key={groupKey} disableGutters>
            <ListItemText primary={auditDetails} />
            {/* {<Default auditDetails={auditDetails} />} */}
          </ListItem>
        )}
      </Box>}</Box>
    </>
  );

  const renderPanel = () => (
    <Drawer
      anchor="right"
      open={opendrawer.right}
      onClose={toggleDrawer("right", false)}
    >
      <Box width={300}> {loading ? <LinearProgress /> : renderListItems()}</Box>
      {isFetching && <p>Fetching items...</p>}
      <LoadMoreButton onLoadMore={queryApi}  id="myHistoryLoadMore" />
    </Drawer>
  );

  return (
    <>
      {renderPanel()}
    </>
  );
};

export default AuditItemPresenter;
