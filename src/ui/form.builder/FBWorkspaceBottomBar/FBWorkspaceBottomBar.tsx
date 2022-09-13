import { Box, Grid, IconButton, TooltipProps, Typography } from "@material-ui/core";
import React from "react";
import { FBTooltip, FBWorkspaceBottomBarProps } from "..";
import { ReactComponent as ExportIcon } from "../../../assets/images/export.svg";
import { ReactComponent as ImportIcon } from "../../../assets/images/import.svg";
import { ReactComponent as PreviewIcon } from "../../../assets/images/preview.svg";
import Text from "../../components/Text";
import FBWorkspaceBottomBarStyles, { tooltipStyles } from "./FBWorkspaceBottomBar.styles";
import { withFBWorkspaceBottomBar } from "./FBWorkspaceBottomBar.wrap";

const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipStyles();
  return <FBTooltip arrow placement="top" classes={classes} {...props} />;
};

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
            <StyledTooltip title="form.builder.form.preview">
              <PreviewIcon />
            </StyledTooltip>
          </IconButton>
          <IconButton
            size="small"
            data-cy="FBWorkspace-exportTemplate"
            disabled={!includeTransport}
            className={classes.exportIcon}
            onClick={exportSchema}
          >
            <StyledTooltip title="form.builder.export.template">
              <ExportIcon />
            </StyledTooltip>
          </IconButton>
          <IconButton
            size="small"
            data-cy="FBWorkspace-importTemplate"
            disabled={!includeTransport}>
            <StyledTooltip title="form.builder.import.template">
              <label htmlFor="fb-import-schema">
                <ImportIcon />
              </label>
            </StyledTooltip>
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withFBWorkspaceBottomBar(FBWorkspaceBottomBar);
