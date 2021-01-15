import { Box } from "@material-ui/core";
import React from "react";
import { FBAttachment, FBFilePresenter, FBFilesPresenterProps, FBMapWrapper } from "..";
import { withFBFilesPresenter } from "./FBFilesPresenter.wrap";

const FBFilesPresenter: React.FunctionComponent<FBFilesPresenterProps> = ({
  attachments = [],
  mode,
}) => (
  <Box display="flex" flexDirection="row" flexWrap="wrap">
    <FBMapWrapper<FBAttachment[]> collection={attachments}>
      {(file: FBAttachment, index) => (
        <FBFilePresenter key={index} {...{ file, mode }} />
      )}
    </FBMapWrapper>
  </Box>
);

export default withFBFilesPresenter(FBFilesPresenter);
