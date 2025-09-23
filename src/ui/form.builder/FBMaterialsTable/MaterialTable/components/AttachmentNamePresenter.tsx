import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';
import React from 'react';
import { attachmentsActions } from '../../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../../state/ducks/attachments/types';
import OverflowingContent from '../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import ViewFile from '../../../../components/common/view.file/container';
import { checkIfFileIsViewable } from '../../../../components/common/view.file/utils/helpers';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { FBAttachment } from '../../../FBFilePresenter/FBFilePresenter.types';
import { FBFilesPresenterProps } from '../../../FBFilesPresenter/FBFilesPresenter.types';
import FBFileUploadState from '../../../FBFileUpload/FBFileUpload.state';
import FBMapWrapper from '../../../FBMapWrapper/FBMapWrapper';
import { withFBFilesPresenter } from './FileNamePresenterWrap';
import { styles } from './styles';

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
  const classes = styles();
  const dialogHandler = useDialog();
  const downloadAttachment = useActionCreator(attachmentsActions.download);
  const [selectedFile, setSelectedFile] = React.useState<FBAttachment | null>(null);

  const removeAttachment = (attachmentId: string) => {
    console.log('removeAttachment', attachmentId);
    fileUploadState?.removeAttachment(attachmentId);
  };

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, '_parent');
    },
    onError: toastError,
  });

  const downloadOrViewFile = (file: FBAttachment) => {
    if (checkIfFileIsViewable(file?.type)) {
      setSelectedFile(file);
      dialogHandler.open();
    } else {
      async.start(downloadAttachment, file, async);
    }
  };

  const closePreviewFile = () => {
    setSelectedFile(null);
    dialogHandler.close();
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
            <div key={id} className={classes.attachmentName}>
              <AttachFile />
              <Box
                className={classes.fileName}
                onClick={() => downloadOrViewFile(file)}
              >
                <OverflowingContent>
                  <span>{`${name}.${type}`}</span>
                </OverflowingContent>
              </Box>
              {/* {!isDisabled && <CloseIcon className={classes.pointer} onClick={() => removeAttachment(id)} />} */}
              {!isDisabled && <FontAwesomeIcon icon={regular('remove')} onClick={() => removeAttachment(id)} />}
            </div>
          );
        }}
      </FBMapWrapper>
      {selectedFile && dialogHandler.isOpen && (
        <ViewFile
          isOpen={dialogHandler.isOpen}
          handleClose={closePreviewFile}
          attachments={[selectedFile]}
          attachment={selectedFile}
        />
      )}
    </Box>
  );
};
export default withFBFilesPresenter(FBAttachmentNamePresenter);
