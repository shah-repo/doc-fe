import { Box } from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';
import React from 'react';
import { FBAttachment, FBFilesPresenterProps, FBMapWrapper } from '../../../../../form.builder';
import { withFBFilesPresenter } from '../../../../../form.builder/FBFilesPresenter/FBFilesPresenter.wrap';

const FBAttachmentNamePresenter: React.FunctionComponent<FBFilesPresenterProps> = ({
  attachments = [],
  boxProps,
}) => (
  <Box { ...boxProps } display="flex" flexDirection="row" flexWrap="wrap">
    <FBMapWrapper<FBAttachment[]> collection={attachments}>
      {(file: FBAttachment) => {
        const { name, type } = file;
        return (<>
          <AttachFile />
          <span>{`${name}.${type}`}</span>
        </>);
      }}
    </FBMapWrapper>
  </Box>
);

export default withFBFilesPresenter(FBAttachmentNamePresenter);
