import { Box, CircularProgress, Typography } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import React from "react";
import { FBContextMenu, FBDialog, FBFilePresenterProps, FBProvider, FBTooltip } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBFilePresenter } from "./FBFilePresenter.wrap";

const FBFileViewPresenter: React.FunctionComponent<FBFilePresenterProps> = ({
  handleIconClick,
  dialogState,
  menuItems,
  fileName,
  loading,
}) =>  (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    <FBContextMenu
      {...{ menuItems }}
      boxProps={{
        p: 0.25,
        mr: 1,
        mt: 1,
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
  </FBProvider>
);

export default withFBFilePresenter(FBFileViewPresenter);
