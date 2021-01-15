import { Box, CircularProgress, IconButton, Typography } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React from "react";
import { FBAttachmentIcon, FBContextMenu, FBDialog, FBFilePresenterProps, FBProvider, FBTooltip } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBFilePresenter } from "./FBFilePresenter.wrap";

const FBFilePresenter: React.FunctionComponent<FBFilePresenterProps> = ({
  handleDownload,
  handleIconClick,
  handleRemove,
  onMouseOver,
  onMouseLeave,
  dialogState,
  toolsVisible,
  disabled,
  menuItems,
  fileName,
  fileShortName,
  loading,
  fileType,
  fileSize,
  fileDescription,
  fileColor,
  mode = "icon",
}) =>  (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    {mode === "icon" && <FBContextMenu
      {...{ menuItems }}
      boxProps={{
        p: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 4,
        bgcolor: toolsVisible ? "white" : "transparent",
        width: { xs: "100%", sm: "100%", md: "50%", lg: "50%", xl: "30%" },
        onMouseOver,
        onMouseLeave,
      }}
    >
      {loading && (
        <Box display="flex" width={46} height={46} alignItems="center" textAlign="center">
          <CircularProgress size={20} />
        </Box>
      )}
      {!loading && (
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
      <Box visibility={(!disabled && toolsVisible) ? "visible" : "hidden"}>
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
    </FBContextMenu>}
    {mode === "raw" &&
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
        {loading && (
          <Box display="flex" width={46} height={46} alignItems="center" textAlign="center">
            <CircularProgress size={20} />
          </Box>
        )}
        {!loading && (
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
    }
  </FBProvider>
);

export default withFBFilePresenter(FBFilePresenter);
