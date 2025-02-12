import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import React, { useRef } from 'react';
import { ReactComponent as CloseIcon } from '../../../../../../assets/images/trash.svg';
import { attachmentsActions } from '../../../../../../state/ducks/attachments';
import { LINE_TYPES } from '../../../../../../state/ducks/attachments/constants';
import { AttachmentDownloadResponse } from '../../../../../../state/ducks/attachments/types';
import ViewFile from '../../../../../components/common/view.file/container';
import { checkIfFileIsViewable } from '../../../../../components/common/view.file/utils/helpers';
import { toastError } from '../../../../../components/notifications';
import { FBAttachment, FBFilesPresenterProps, FBFileUploadState } from '../../../../../form.builder';
import { withFBFilesPresenter } from '../../../../../form.builder/FBFilesPresenter/FBFilesPresenter.wrap';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import OverflowingContent from '../../commonCells/OveflowContent';
import { styles } from './cells/styles';

interface Props extends FBFilesPresenterProps {
  isDisabled?: boolean
  fileUploadState?: FBFileUploadState
  width?: number | string
}

const FBAttachmentNamePresenter: React.FC<Props> = ({
  attachments = [],
  boxProps,
  isDisabled,
  fileUploadState,
  width = 235,
}) => {
  const dialogHandler = useDialog();
  const classes = styles();
  const fileToView = useRef<FBAttachment | null>(null);

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, '_parent');
    },
    onError: toastError,
  });

  const downloadAttachment = useActionCreator(attachmentsActions.download);

  const removeAttachment = (attachmentId: string) => {
    fileUploadState?.removeAttachment(attachmentId);
  };

  const downloadOrViewFile = (file: FBAttachment) => {
    if (checkIfFileIsViewable(file?.type)) {
      fileToView.current = file;
      dialogHandler.open();
    } else {
      async.start(downloadAttachment, file, async);
    }
  };

  const closeFilePreview = () => {
    fileToView.current = null;
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
      {attachments.map(file => {
        const { name, type, id, lineType } = file;
        const isRedline = lineType === LINE_TYPES.RED_LINE;

        return (
          <div className={classes.attachmentName}>
            <div className={cx({ [classes.redLine]: isRedline })}>
              <FontAwesomeIcon
                icon={regular('paperclip')}
                className={classes.attachmentIcon}
              />
            </div>
            <Box
              width={width}
              onClick={() => downloadOrViewFile(file)}
              className={classes.attchmentNameWrapper}
            >
              <OverflowingContent>
                <span>{`${name}.${type}`}</span>
              </OverflowingContent>
            </Box>
            {!isDisabled && (
              <CloseIcon cursor="pointer" onClick={() => removeAttachment(id)} />
            )}
          </div>
        );
      })}
      {fileToView.current && dialogHandler.isOpen && (
        <ViewFile
          isOpen={dialogHandler.isOpen}
          handleClose={closeFilePreview}
          attachments={[fileToView.current]}
          attachment={fileToView.current}
        />
      )}
    </Box>
  );
};

export default withFBFilesPresenter(FBAttachmentNamePresenter);
