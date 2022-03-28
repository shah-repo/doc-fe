import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { useSelector } from "react-redux";
import { historySelectors } from "../../../state/ducks/userManagement";
import { AsyncStatus } from "../../../state/types";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import EmployeeActivated from "./Cards/EmployeeActivated.presenter";
import styles from "./styles";

type Anchor =  "right";
interface OwnProps {
  openHistoryPanel: boolean;
  closeHistoryPanel: (panel: boolean) => void;
}
const AuditItemPresenter: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  const loadAsyncState = useSelector(historySelectors.getLoadHistoryListAsyncInfo);
  const loading = ![AsyncStatus.Success, AsyncStatus.Error].includes(loadAsyncState.status);
  const classes = styles();
  const auditItems: any = useSelector(historySelectors.historyList);
  const [opendrawer, setOpenDrawer] = React.useState({
    right: openHistoryPanel,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpenDrawer({ ...opendrawer, [anchor]: open });
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
      <Box className={classes.listItemContainer} style={{ overflow: "auto" }}>
        {auditItems.results.map((auditItem, index) =>
          <ListItem key={index} disableGutters>
            <EmployeeActivated />
          </ListItem>
        )}
      </Box>
    </>
  );

  const renderPanel = () => (
    <Drawer
      anchor="right"
      open={opendrawer.right}
      onClose={toggleDrawer("right", false)}
      onClick={() => {
        closeHistoryPanel(opendrawer.right);
      }}
    >
      <Box width={300}> {loading ? <LinearProgress /> : renderListItems()}</Box>
    </Drawer>
  );

  return (
    <>
      {renderPanel()}
    </>
  );
};

export default AuditItemPresenter;
