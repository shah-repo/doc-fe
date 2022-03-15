import { Box, Grid, Portal } from "@material-ui/core";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBDialogProps } from "../../../../../../../ui/form.builder";
import { withFBDialog } from "../../../../../../../ui/form.builder/FBDialog/FBDialog.wrap";

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
  {/* <Dialog
    fullWidth={true}
    fullScreen={useMediaQuery(useTheme().breakpoints.down(maxWidth || "sm"))}
    {...{ open, maxWidth }}
  > */}
  {/* <DialogTitle>
      <Box display="flex" flexDirection="row-reverse">
        <CloseIcon fontSize="large" data-cy="dialog-close" onClick={handleClose} />
      </Box>
      {(hasIn(title, "locale") || isString(title)) && (
        <FBText
          locale={(title as FBLabelLocaleProps)?.locale || title as string}
          values={(title as FBLabelLocaleProps)?.values}
          boxProps={{
            fontWeight: "fontWeightBold",
            textAlign: "left",
            border: 1,
            // MUI border color issue
            borderTop: 0,
            borderLeft: 0,
            borderRight: 0,
            borderColor: Colors.hint_gray,
            mt: -2,
            mb: 2,
          }}
        />
      )}
      <div ref={handleTitleRef} />
    </DialogTitle> */}
  {/* <DialogContent> */}
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Grid container>
      <Grid item>
        <div ref={handleTitleRef} />
      </Grid>
      <Grid item>
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

  {/* </DialogContent> */}
  {/* <DialogActions style={{ margin: 0 }}>
      <div ref={handleActionsRef} />
    </DialogActions> */}
  {/* </ Dialog> */}
</>
);

export default withFBDialog(LeftPanelFormEditor);
