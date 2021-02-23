import { Box, CircularProgress, IconButton } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { isEmpty } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBAttachmentIcon, FBContextMenu, FBFilePresenterModeProps, FBText, FBTooltip } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBFilePresenterIcon: React.FunctionComponent<FBFilePresenterModeProps> = ({
  filePresenterState,
  handleIconClick,
  handleRemove,
  onMouseOver,
  onMouseLeave,
  file,
  fileName,
  fileColor,
  fileType,
  fileShortName,
  fileSize,
  fileExtension,
  disabled,
  menuItems,
  boxProps,
  fileDescription,
  omitDescription,
}) =>  useObserver(() => (
  <FBContextMenu
    menuId={file.id}
    {...{ menuItems }}
    boxProps={{
      p: 2,
      borderRadius: 4,
      bgcolor: filePresenterState?.toolsVisible ? "white" : "transparent",
      width: { xs: "100%", sm: "100%", md: "50%", lg: "50%", xl: "30%" },
      onMouseOver,
      onMouseLeave,
      ...boxProps,
    }}
  >
    <Box display="flex" flexDirection="row" alignItems="center">
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
          {fileSize} {fileExtension}
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
          {...{ disabled }}
        >
          <RemoveCircleOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
    {!omitDescription && (
      <Box mt={1} fontSize={12.5}>
        {isEmpty(fileDescription) && (
          <FBText boxProps={{ fontStyle: "italic" }} locale="form.builder.no.description" />
        )}
        {!isEmpty(fileDescription) && fileDescription}
      </Box>
    )}
  </FBContextMenu>
));

export default FBFilePresenterIcon;
