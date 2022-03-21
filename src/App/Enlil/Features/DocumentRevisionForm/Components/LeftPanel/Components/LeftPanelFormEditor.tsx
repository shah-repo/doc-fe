import { Box, Grid, Portal } from "@material-ui/core";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBDialogProps } from "../../../../../../../ui/form.builder";
import { withFBLeftPanelDialog } from "../../../../../../../ui/form.builder/FBLeftPanelDialog/FBLeftPanelDialog.wrap";

const LeftPanelFormEditor: React.FunctionComponent<FBDialogProps> = ({
  handleActionsRef,
  handleTitleRef,
  handleClose,
  portalAction,
  portalTitle,
  open = false,
  title,
  content,
  actions,
  maxWidth,
}) => (<>
  <Box
    display="flex"
    p={1}
    width={"100%"}
  >
    <Grid container style={{ height: "calc(100vh - 86px)", overflow: "auto" }} >
      <Grid item>
        <div ref={handleTitleRef} />
      </Grid>
      <Grid item style={{ height: "calc(100vh - 230px)", overflow: "auto", marginLeft: "14px" }}>
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
      <Grid item>
        <div ref={handleActionsRef} />
      </Grid>
    </Grid>
  </Box>
</>
);

export default withFBLeftPanelDialog(LeftPanelFormEditor);
