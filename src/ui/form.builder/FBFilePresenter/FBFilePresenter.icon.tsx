import { Box, CircularProgress, IconButton } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { useObserver } from "mobx-react";
import React from "react";
import { FBAttachmentIcon, FBContextMenu, FBFilePresenterModeProps, FBTooltip } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBFilePresenterIcon: React.FunctionComponent<FBFilePresenterModeProps> = ({
  filePresenterState,
  handleIconClick,
  handleRemove,
  onMouseOver,
  onMouseLeave,
  fileName,
  fileColor,
  fileType,
  fileShortName,
  fileSize,
  fileDescription,
  disabled,
  menuItems,
}) =>  useObserver(() => (
  <FBContextMenu
    {...{ menuItems }}
    boxProps={{
      p: 2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 4,
      bgcolor: filePresenterState?.toolsVisible ? "white" : "transparent",
      width: { xs: "100%", sm: "100%", md: "50%", lg: "50%", xl: "30%" },
      onMouseOver,
      onMouseLeave,
    }}
  >
    {filePresenterState?.loading && (
      <Box display="flex" width={46} height={46} alignItems="center" textAlign="center">
        <CircularProgress size={20} />
      </Box>
    )}
    {!filePresenterState?.loading && (
      <FBTooltip title={fileName}>
        <FBAttachmentIcon
          boxProps={{
            width: 46,
            height: 46,
            color: fileColor,
            onClick: () => handleIconClick?.(),
          }}
          text={fileType}
        />
      </FBTooltip>
    )}
    <Box ml={1.5} mr={2} width="75%" fontSize={12} fontWeight="fontWeightBold">
      {fileShortName}
      <Box fontWeight="fontWeightRegular">
        {fileSize} {fileDescription}
      </Box>
    </Box>
    <Box visibility={(!disabled && filePresenterState?.toolsVisible) ? "visible" : "hidden"}>
      <IconButton
        size="small"
        style={{
          borderRadius: 5,
          padding: "6px",
          color: Colors.medium_red,
          background: Colors.light_red,
        }}
        onClick={handleRemove}
      >
        <RemoveCircleOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  </FBContextMenu>
));

export default FBFilePresenterIcon;
