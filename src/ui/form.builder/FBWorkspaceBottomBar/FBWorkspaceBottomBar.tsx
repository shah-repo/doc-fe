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
  children,
  handleFormPreview,
  importSchema,
  exportSchema,
  includeTransport,
  previewDisabled,
  ...boxProps
}) => {
  const classes = FBWorkspaceBottomBarStyles();

  return (
    <Box display="flex" className="formOptionsBox" justifyContent="center" p={1} { ...boxProps }>
      <Grid container justify="space-between" alignItems="center" className={classes.formOptionsBox}>
        <Grid item>
          <Typography className={classes.formOptionsText} data-cy='form-options-text'>
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
            data-cy="FBWorkspace-exportTemplate"
            disabled={!includeTransport}
            className={classes.exportIcon}
            onClick={exportSchema}
          >
            <FBTooltip title="form.builder.export.template">
              <ExportIcon />
            </FBTooltip>
          </IconButton>
          <IconButton
            size="small"
            data-cy="FBWorkspace-importTemplate"
            disabled={!includeTransport}
          >
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
