import { Box, IconButton } from "@material-ui/core";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React from "react";
import { FBTooltip, FBWorkspaceBottomBarProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBWorkspaceBottomBar } from "./FBWorkspaceBottomBar.wrap";

const FBWorkspaceBottomBar: React.FunctionComponent<FBWorkspaceBottomBarProps> = ({
  handleFormPreview,
  importSchema,
  exportSchema,
  includeTransport,
  previewDisabled,
}) => (
    <Box display="flex" flexDirection="row-reverse" p={1} mt={2} bgcolor={Colors.light_gray}>
      <input
        hidden={true}
        id="fb-import-schema"
        type="file"
        accept=".json"
        onChange={importSchema}
      />
      <IconButton
        size="small"
        disabled={!includeTransport}
        onClick={exportSchema}
      >
        <FBTooltip title="form.builder.export.template">
          <VerticalAlignTopIcon />
        </FBTooltip>
      </IconButton>
      <IconButton size="small" disabled={!includeTransport}>
        <FBTooltip title="form.builder.import.template">
          <label htmlFor="fb-import-schema">
            <VerticalAlignBottomIcon />
          </label>
        </FBTooltip>
      </IconButton>
      <IconButton
        size="small"
        id="FBWorkspace-clickView"
        data-cy="FBWorkspace-clickView"
        disabled={previewDisabled}
        onClick={handleFormPreview}
      >
        <FBTooltip title="form.builder.form.preview">
          <VisibilityIcon />
        </FBTooltip>
      </IconButton>
    </Box>
  );

export default withFBWorkspaceBottomBar(FBWorkspaceBottomBar);
