import { Box, CircularProgress, Drawer, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { isEmpty, map, values } from "lodash";
import qs from "query-string";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import apiClient from "../../../state/apiClient";
import { GM_AUDIT_HISTORY_INITIAL_OFFSET, GM_AUDIT_HISTORY_LIMIT, GM_AUDIT_URL } from "../../../state/ducks/userManagement/constants";
import { AuditDetailsProps, GMAuditProps } from "../../../state/ducks/userManagement/types";
import { store } from "../../../state/store";
import Default from "../../components/common/audit.history/Cards/Default";
import LoadMoreButton from "../../components/common/load.more.button/LoadMoreButton";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import styles from "./styles";

let call: CancelTokenSource;
interface OwnProps {
  openHistoryPanel: boolean;
  closeHistoryPanel: (panel: boolean) => void;
  getCardGroups: (records: GMAuditProps[]) => object;
}

const AuditItemPresenter: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
  getCardGroups,
}) => {
  const classes = styles();
  const intl = useIntl();
  const limit = GM_AUDIT_HISTORY_LIMIT;
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDrawer, setOpenDrawer] = React.useState({ right: openHistoryPanel });
  const [Items, setItems] = React.useState<AuditDetailsProps[]>([]);
  const [page, setPage] = useState(GM_AUDIT_HISTORY_INITIAL_OFFSET);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [overallLimit, setOverallLimit] = React.useState(0);
  const [dataTotal, setDataTotal] = React.useState(0);
  const closeDrawer = () => {
    setOpenDrawer({ ...openDrawer, right: false });
    closeHistoryPanel(openDrawer.right);
  };

  React.useEffect(() => {
    fetchAuditRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAuditRecords = () => {
     call?.cancel();
     call = axios.CancelToken.source();
     setIsLoading(true);
     setLoadMore(true);
     setErrorMessage("");
     setOverallLimit(overallLimit + GM_AUDIT_HISTORY_LIMIT);
     const requestConfig: AxiosRequestConfig = {
       method: "get",
       url: GM_AUDIT_URL,
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
         setShowLoadMoreButton(true);
         setLoadMore(data.page_total > 0);
         setDataTotal(data.total);
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
      <div data-cy="external-container" className={classes.externalContainer}>
        <div className={classes.titleOuterContainer}>
          <div className={classes.titleContainer}>
            <Text translation="document.revision.history" />
          </div>
          <div className={classes.iconContainer} >
            <IconButton
              style={{ width: "23px" }}
              color="default"
              onClick={() => closeDrawer()}
              aria-label="Close"
              disableFocusRipple
              disableRipple
              disableTouchRipple
              data-cy="gm-close-history-panel"
            >
              <CloseIcon style={{ color: Colors.gray }} />
            </IconButton>
          </div>
        </div>
      </div>
      {isLoading && <Box position="absolute" top="50%" left="40%"><CircularProgress /></Box> }
      <Box className={classes.listItemContainer}>
        {map(Items, (auditDetails, groupKey) => (
          <Box key={groupKey} style={{ padding: 0 }}>
            {<Default auditDetails={auditDetails} />}
          </Box>)
        )}
      </Box>
    </>
  );

  return (
    <Drawer anchor="right" open={openDrawer.right} onClose={closeDrawer}>
      <Box className={classes.root}>
        {renderAuditRecords()}
        {!isEmpty(errorMessage) && <div style={{ color: "red" }}>{errorMessage}</div>}
        {showLoadMoreButton && (
          <Box className={classes.listActions}>
            <LoadMoreButton
              disable={isLoading || !loadMore || overallLimit >= dataTotal}
              onLoadMore={fetchAuditRecords}
              id="historyLoadMore"
              className={classes.loadMore}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default AuditItemPresenter;
