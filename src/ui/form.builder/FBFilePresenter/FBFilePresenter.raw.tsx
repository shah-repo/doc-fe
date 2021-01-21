import { Box, CircularProgress, Typography } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import { useObserver } from "mobx-react";
import React from "react";
import { FBContextMenu, FBFilePresenterModeProps, FBTooltip } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBFilePresenterRaw: React.FunctionComponent<FBFilePresenterModeProps> = ({
  filePresenterState,
  handleIconClick,
  fileName,
  menuItems,
}) =>  useObserver(() => (
  <FBContextMenu
    {...{ menuItems }}
    boxProps={{
      p: 0.25,
      mr: 1,
      mb: 2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 4,
      bgcolor: Colors.background_blue,
    }}
  >
    {filePresenterState?.loading && (
      <Box display="flex" width={46} height={46} alignItems="center" textAlign="center">
        <CircularProgress size={20} />
      </Box>
    )}
    {!filePresenterState?.loading && (
      <FBTooltip title={fileName}>
        <Box
          onClick={() => handleIconClick?.()}
          display="inline-flex"
          alignItems="center"
          mr={1}
          pt={0.5}
        >
          <AttachFile color="primary" height={20} width={20} />
          <Typography
            id="FBFileViewPresenter-fileName"
            variant="caption"
            color="primary"
            noWrap={true}
          >
            {fileName}
          </Typography>
        </Box>
      </FBTooltip>
    )}
  </FBContextMenu>
));

export default FBFilePresenterRaw;
