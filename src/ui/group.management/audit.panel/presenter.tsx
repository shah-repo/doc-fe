import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
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
import { LoadMoreButton } from "../../components/common/audit.history/LoadMoreButton";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [openDrawer, setOpenDrawer] = React.useState({ right: openHistoryPanel });
  const [Items, setItems] = React.useState<AuditDetailsProps[]>([]);
  const [page, setPage] = useState(GM_AUDIT_HISTORY_INITIAL_OFFSET);

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
     setErrorMessage("");
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
      {<LoadMoreButton disable={isLoading} onLoadMore={fetchAuditRecords}  id="historyLoadMore" />}
    </Drawer>
  );
};

export default AuditItemPresenter;
