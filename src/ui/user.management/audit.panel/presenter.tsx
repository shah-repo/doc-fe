import { Box, Drawer, LinearProgress } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { historySelectors } from "../../../state/ducks/userManagement";
import { AsyncStatus } from "../../../state/types";
import PanelCard from "./panel.card";

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
        <Box style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "10px 5px 10px 20px",
          position: "static",
          width: "300px",
          height: "43px",
          left: "0px",
          top: "0px",
          background: "#FFFFFF",
          boxShadow: "0px 1px 0px #CCD4D9",
          flex: "none",
          order: 0,
          alignSelf: "stretch",
          flexGrow: 0,
          margin: "1px 0px",
        }}>

          <div style={{
            position: "static",
            width: "46px",
            fontFamily: "Sora",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "15px",
            color: "#162229",
            flex: "none",
            order: 0,
            flexGrow: 0,
            margin: "0px 2px",
          }}>
            History
          </div>
        </Box>
        <PanelCard/>
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
