import { Box } from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';
import React from 'react';
import { ReactComponent as CloseIcon } from '../../../../../../assets/images/trash.svg';
import { attachmentsActions } from '../../../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../../../state/ducks/attachments/types';
import ViewFile from '../../../../../components/common/view.file/container';
import { checkIfFileIsViewable } from '../../../../../components/common/view.file/utils/helpers';
import { toastError } from '../../../../../components/notifications';
import {
  FBAttachment,
  FBFilesPresenterProps,
  FBFileUploadState,
  FBMapWrapper,
} from '../../../../../form.builder';
import { withFBFilesPresenter } from '../../../../../form.builder/FBFilesPresenter/FBFilesPresenter.wrap';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import OverflowingContent from '../../commonCells/OveflowContent';
import { styles } from './cells/styles';

interface Props extends FBFilesPresenterProps {
  isDisabled?: boolean
  fileUploadState: FBFileUploadState
}

const FBAttachmentNamePresenter: React.FunctionComponent<Props> = ({
  attachments = [],
  boxProps,
  isDisabled,
  fileUploadState,
}) => {
  const removeAttachment = (attachmentId: string) => {
    fileUploadState?.removeAttachment(attachmentId);
  };

  const dialogHandler = useDialog();
  const classes = styles();

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, '_parent');
    },
    onError: toastError,
  });

  const downloadAttachment = useActionCreator(attachmentsActions.download);

  const downloadOrViewFile = (file: FBAttachment) => {
    if (checkIfFileIsViewable(file?.type)) {
      dialogHandler.open();
    } else {
      async.start(downloadAttachment, file, async);
    }
  };

  return (
    <Box
      {...boxProps}
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
    >
      <FBMapWrapper<FBAttachment[]> collection={attachments}>
        {(file: FBAttachment) => {
          const { name, type, id } = file;
          return (
            <div className={classes.attachmentName}>
              <AttachFile />
              <Box
                width={253}
                marginLeft={0.75}
                marginRight={0.75}
                onClick={() => downloadOrViewFile(file)}
              >
                <OverflowingContent>
                  <span>{`${name}.${type}`}</span>
                </OverflowingContent>
              </Box>
              {file && dialogHandler.isOpen && (
                <ViewFile
                  isOpen={dialogHandler.isOpen}
                  handleClose={dialogHandler.close}
                  attachments={[file]}
                  attachment={file}
                />
              )}
              {!isDisabled && (
                <CloseIcon cursor="pointer" onClick={() => removeAttachment(id)} />
              )}
            </div>
          );
        }}
      </FBMapWrapper>
    </Box>
  );
};
export default withFBFilesPresenter(FBAttachmentNamePresenter);
