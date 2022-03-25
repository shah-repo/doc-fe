import { Box, Drawer, IconButton, LinearProgress } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { useSelector } from "react-redux";
import { historySelectors } from "../../../state/ducks/userManagement";
import { AsyncStatus } from "../../../state/types";
import Colors from "../../layout/theme/utils/colors";
import PanelCard from "./panel.card";
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
  const list = (anchor: Anchor) => {
    // For testing
    auditItems.results = auditItems.results.splice(0, 1);
    return (
      <>
        <div className={classes.externalContainer}>
          <div className={classes.titleOuterContainer}>
            <div  className={classes.titleContainer}
            >
            History
            </div>
            <div
              className={classes.iconContainer}
            >
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
              </IconButton></div>
          </div>
        </div>
        <Box height={710} style={{ overflow: "auto" }}>
          <PanelCard/>
        </Box>
        {/* <div
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            {auditItems.results.map((docObj, index) => (
              <ListItem button key={docObj.docRevName}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={docObj.docRevName} />
              </ListItem>
            ))}
          </List>
        </div> */}
      </>
    );
  };

  const renderPanel = () => (<div>
    <Box>
      <Drawer anchor="right" open={opendrawer.right} onClose={toggleDrawer("right", false)} onClick={() => {
        closeHistoryPanel(opendrawer.right);
      }}>
        <div style={{ width: "300px" }}> {loading ? <LinearProgress style={{ width: "100%" }} /> : list("right")}</div>
      </Drawer>
    </Box>
  </div>);

  return (
    <>
      {renderPanel()}
    </>
  );
};

export default AuditItemPresenter;
