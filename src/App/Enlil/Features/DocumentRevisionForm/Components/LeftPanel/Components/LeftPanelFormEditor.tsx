import { Box, Grid, Portal } from "@material-ui/core";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBDialogProps } from "../../../../../../../ui/form.builder";
import { withFBLeftPanel } from "../../../../../../../ui/form.builder/FBLeftPanel/FBLeftPanel.wrap";
import styles from "./LeftPanelFormEditor.styles";

const LeftPanelFormEditor: React.FunctionComponent<FBDialogProps> = ({
  handleActionsRef,
  handleTitleRef,
  portalAction,
  portalTitle,
  title,
  content,
  actions,
}) => {
  const classes = styles();
  return (
    <Box className={classes.leftPanelEditorForm}>
      <Grid container className={classes.rootContainer} >
        <Grid item className={classes.headerItem}>
          <div ref={handleTitleRef} />
        </Grid>
        <Grid item className={classes.grid}>
          {content && portalTitle && portalAction && (
            <content.type {...content.props}>
              {content.props.children}
              {!isString(title) && !hasIn(title, "locale") && (
                <Portal container={portalTitle}>
                  {title}
                </Portal>
              )}
              <Portal container={portalAction}>
                {actions}
              </Portal>
            </content.type>
          )}
        </Grid>
        <Grid item className={classes.gridItem}>
          <div ref={handleActionsRef} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default withFBLeftPanel(LeftPanelFormEditor);
