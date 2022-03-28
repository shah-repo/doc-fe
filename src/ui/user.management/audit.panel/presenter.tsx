import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { map } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { historySelectors } from "../../../state/ducks/userManagement";
import { AsyncStatus } from "../../../state/types";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import Default from "./Cards/Default";
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
  const cardGroups: any = useSelector(historySelectors.historyGroups);
  console.log("debug: cardGroups :: ", cardGroups);
  const [opendrawer, setOpenDrawer] = React.useState({
    right: openHistoryPanel,
  });

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
        {map(cardGroups, (auditDetails, groupKey) =>
          <ListItem key={groupKey} disableGutters>
            {<Default auditDetails={auditDetails} />}
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
