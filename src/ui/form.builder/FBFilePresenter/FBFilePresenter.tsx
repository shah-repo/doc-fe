import { Box, IconButton, Tooltip } from "@material-ui/core";
import { CancelOutlined, InsertDriveFile } from "@material-ui/icons";
import React from "react";
import { FBFilePresenterProps } from ".";
import { FBContextMenu } from "..";
import { withFBFilePresenter } from "./FBFilePresenter.wrap";

const FBFilePresenter: React.FunctionComponent<FBFilePresenterProps> = ({
  disabled,
  handleRemove,
  handleDownload,
  menuItems,
  fileName,
  fileShortName,
  fileType,
}) =>  (
  <FBContextMenu {...{ menuItems }}>
    <Box width={{ xs: 50, sm: 60, md: 70, lg: 80 }} mr={2}>
      <Box width="100%" pt="140%" position="relative">
        <Box position="absolute" left={0} top={0} width="100%" height="100%">
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" color="primary" onClick={handleRemove} {...{ disabled }}>
              <CancelOutlined fontSize="small" />
            </IconButton>
          </Box>
          <Tooltip title={fileName}>
            <Box
              px={{ xs: 0, sm: 0, md: 1 }}
              mt={{ xs: -0.5, sm: -1, md: -2.5 }}
              onClick={handleDownload}
              display="flex"
              justifyItems="center"
              height="55%"
            >
              <InsertDriveFile style={{ width: "100%", height: "100%", color: "#ccc" }} />
              <Box
                display={{ xs: "none", sm: "block" }}
                ml={{ sm: "-82%", md: "-89%" }}
                position="relative"
                width={{ sm: "62%", md: "76%" }}
                height="100%"
              >
                <Box
                  position="relative"
                  width="100%"
                  top="55%"
                  height="30%"
                  bgcolor="primary.main"
                  color="white"
                  fontSize={{ sm: 9, md: 12 }}
                  textAlign="center"
                  fontWeight="bold"
                >
                  {fileType}
                </Box>
                <Box
                  style={{ borderStyle: "solid", borderWidth: "3px 5px 0 0" }}
                  borderColor="transparent #99c transparent transparent"
                  display={{ sm: "none", md: "block" }}
                  top="50%"
                  left="0"
                  position="absolute"
                  height="0"
                  width="0"
                />
                <Box
                  style={{ borderStyle: "solid", borderWidth: "3px 0 0 5px" }}
                  borderColor="transparent transparent transparent #99c"
                  display={{ sm: "none", md: "block" }}
                  top="50%"
                  right="0"
                  position="absolute"
                  height="0"
                  width="0"
                />
              </Box>
            </Box>
          </Tooltip>
          <Box
            textAlign="center"
            justifyContent="center"
            lineHeight={1.1}
            display={{ xs: "none", sm: "none", md: "flex" }}
            fontSize={12}
          >
            {fileShortName}
          </Box>
        </Box>
      </Box>
    </Box>
  </FBContextMenu>
);

export default withFBFilePresenter(FBFilePresenter);
