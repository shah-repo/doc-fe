import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { FBTooltip, FBWorkspaceBottomBarProps } from "..";
import { ReactComponent as ExportIcon } from "../../../assets/images/export.svg";
import { ReactComponent as ImportIcon } from "../../../assets/images/import.svg";
import { ReactComponent as PreviewIcon } from "../../../assets/images/preview.svg";
import Text from "../../components/Text";
import FBWorkspaceBottomBarStyles from "./FBWorkspaceBottomBar.styles";
import { withFBWorkspaceBottomBar } from "./FBWorkspaceBottomBar.wrap";

const FBWorkspaceBottomBar: React.FunctionComponent<FBWorkspaceBottomBarProps> = ({
  handleFormPreview,
  importSchema,
  exportSchema,
  includeTransport,
  previewDisabled,
}) => {
  const classes = FBWorkspaceBottomBarStyles();
  return (
    // <Box display="flex" flexDirection="row-reverse" p={1} mt={2} bgcolor={Colors.light_gray}>
    //   <input
    //     hidden={true}
    //     id="fb-import-schema"
    //     type="file"
    //     accept=".json"
    //     onChange={importSchema}
    //   />
    //   <IconButton
    //     size="small"
    //     disabled={!includeTransport}
    //     onClick={exportSchema}
    //   >
    //     <FBTooltip title="form.builder.export.template">
    //       <VerticalAlignTopIcon />
    //     </FBTooltip>
    //   </IconButton>
    //   <IconButton size="small" disabled={!includeTransport}>
    //     <FBTooltip title="form.builder.import.template">
    //       <label htmlFor="fb-import-schema">
    //         <VerticalAlignBottomIcon />
    //       </label>
    //     </FBTooltip>
    //   </IconButton>
    //   <IconButton
    //     size="small"
    //     id="FBWorkspace-clickView"
    //     data-cy="FBWorkspace-clickView"
    //     disabled={previewDisabled}
    //     onClick={handleFormPreview}
    //   >
    //     <FBTooltip title="form.builder.form.preview">
    //       <VisibilityIcon />
    //     </FBTooltip>
    //   </IconButton>
    // </Box>
    <Box display="flex" className="formOptionsBox" justifyContent="center" p={1} mt={2}>
      <Grid container justify="space-between" alignItems="center" className={classes.formOptionsBox}>
        <Grid item>
          <Typography className={classes.formOptionsText}>
            <Text translation="form.options" />
          </Typography>
        </Grid>
        <Grid item className={classes.formOptionsIcons}>
          <input
            hidden={true}
            id="fb-import-schema"
            type="file"
            accept=".json"
            onChange={importSchema}
          />
          <IconButton
            size="small"
            id="FBWorkspace-clickView"
            data-cy="FBWorkspace-clickView"
            disabled={previewDisabled}
            className={classes.previewIcon}
            onClick={handleFormPreview}
          >
            <FBTooltip title="form.builder.form.preview">
              <PreviewIcon />
            </FBTooltip>
          </IconButton>
          <IconButton
            size="small"
            disabled={!includeTransport}
            className={classes.exportIcon}
            onClick={exportSchema}
          >
            <FBTooltip title="form.builder.export.template">
              <ExportIcon />
            </FBTooltip>
          </IconButton>
          <IconButton size="small" disabled={!includeTransport}>
            <FBTooltip title="form.builder.import.template">
              <label htmlFor="fb-import-schema">
                <ImportIcon />
              </label>
            </FBTooltip>
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withFBWorkspaceBottomBar(FBWorkspaceBottomBar);
