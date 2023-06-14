import { Box, Button, ButtonBase, CircularProgress, Tooltip, Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as RemoveDocument } from '../../../../assets/images/trash.svg';
import { ReactComponent as RemoveDocumentActive } from '../../../../assets/images/trashHover.svg';
import { Attachment } from '../../../../state/ducks/attachments/types';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../state/ducks/documentRevisions';
import { Document, DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../state/reducers';
import Text from '../../../components/Text';
import { CustomStyleTooltip } from '../../../dashboard.new/line.items/common/CustomStyleTooltip';
import { documentRevisionStatusContextFromDocList } from '../../../documentRevision/DocumentRevisionsManager.container';
import { isDocumentRevisionReleased } from '../../../documentRevision/helpers/documentRevisionStatus';
import FileIcon from './icon';
import { styles } from './utils/styles';
import { AttachmentIconProps } from './utils/types';

const AttachmentIconPresenter: React.FunctionComponent<
AttachmentIconProps
> = ({
  attachment,
  size,
  handleRemove,
  handleContextMenu,
  disabled = false,
  isLoading,
  isUploading,
  isRedLine,
  handleIconClick,
  canDeleteFile,
  isNewVersion,
  documentRevisionData,
  ...other
}) => {
  const file = attachment || {} as Attachment;
  const [isMouseInside, setMouseInside] = useState(false);
  const [removeHover, setRemoveHover] = useState(false);

  const classes = styles({
    size: size || 'md',
    disabled,
  });
  const intl = useIntl();
  const fileSize = useMemo(() => {
    const size = file.fileSizeS3Link;
    const i = size !== 0 ? Math.floor( Math.log(size) / Math.log(1024)) : 0.00;
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
  }, [file.fileSizeS3Link]);
  const fileTypeDescription = useMemo(() => {
    const microsoftFiles = ['XLSX', 'XLS', 'DOCX', 'DOC'];
    const type = file.type.toUpperCase();
    if (microsoftFiles.includes(type)) {
      return intl.formatMessage({ id: `file.type.${type}` });
    }

    return intl.formatMessage({ id: 'file.type' }, { type });
  }, [file.type, intl]);
  const isPrimary = file.id === documentRevisionData?.primaryAttachment?.id;

  const isUploadingRenderer = () => (
    <Box>
      <Text translation="common.uploading" />
    </Box>
  );
  const documentRevisionStatusFromDocList = React.useContext(documentRevisionStatusContextFromDocList);

  const formDocumentId = documentRevisionData?.document.id || '';
  const formDocuments: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, formDocumentId),
  );
  const releasedVersions = formDocuments?.documentRevisions.filter((e) => isDocumentRevisionReleased(e.status));
  const lastReleasedDocRevId = releasedVersions?.[releasedVersions.length - 1]?.id;
  const docRevById = useSelector(documentRevisionsSelectors.byId);
  const dispatch = useDispatch();

  useEffect(() => {
    if ((!lastReleasedDocRevId || docRevById[lastReleasedDocRevId]?.attachments)) {
      return;
    }
    dispatch(documentRevisionsActions.load(lastReleasedDocRevId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTransferred = isNewVersion
  || lastReleasedDocRevId !== formDocuments?.documentRevisions[formDocuments?.documentRevisions.length - 1]?.id
  ?  docRevById[lastReleasedDocRevId]?.attachments?.some((e) => e.id === attachment?.id) : false;

  const deleteButtonRenderer = canDeleteFile && (
    <Box
      marginLeft="auto"
      marginRight="10px"
      visibility={isMouseInside ? 'visible' : 'hidden'}
      borderRadius={4}
      onMouseEnter={() => setRemoveHover?.(!disabled)}
      onMouseLeave={() => setRemoveHover?.(false)}
    >
      <Button
        className={classes.removeButton}
        onClick={handleRemove && handleRemove(file)}
        id="AttachmentIconPresenter-handleRemove"
      >
        {removeHover ? (
          <CustomStyleTooltip
            title={<Text translation="common.delete" />}
            placement="top"
            arrow
            classes={{
              tooltipPlacementTop: classes.tooltipPlacementTop,
            }}
          >
            <RemoveDocumentActive />
          </CustomStyleTooltip>
        ) : (
          <RemoveDocument />
        )}
      </Button>
    </Box>
  );

  return (
    <div
      className={classes.attachmentContainer}
      data-cy="attachment"
      onMouseEnter={() => setMouseInside?.(!disabled)}
      onMouseLeave={() => setMouseInside?.(false)}
    >
      <div className={classes.iconContainer}>
        <Tooltip title={`${file.name}.${file.type}`}>
          <ButtonBase
            onContextMenu={handleContextMenu?.(file)}
            key={`icon-${file.id}`}
            onClick={handleIconClick?.(file)}
            id="AttachmentIconPresenter-handleIconClick"
          >
            {isLoading && <CircularProgress className={classes.progress} />}
            {!isLoading
              && <FileIcon
                {...other}
                attachment={attachment}
                extension={file.type}
                isUploading={isUploading}
                isRedLine={isRedLine}
                isPrimary={isPrimary}
                isTransferred={(documentRevisionStatusFromDocList === DocumentRevisionStatus.Draft
                  || documentRevisionStatusFromDocList === DocumentRevisionStatus.PendingChange)  ? isTransferred : false}
              />
            }
          </ButtonBase>
        </Tooltip>
      </div>
      <div
        className={classes.fileNameContainer}
        onClick={handleIconClick?.(file)}
        onContextMenu={handleContextMenu?.(file)}
      >
        <Typography
          className={classNames(classes.fileName, {
            [classes.isUploading]: isUploading,
          })}
          variant="caption"
          gutterBottom={true}
          align="left"
          title={`${file.name}.${file.type}`}
          id="AttachmentIconPresenter-fileTitle"
          data-cy="attachment.title"
        >
          {`${file.name}.${file.type}`}
        </Typography>
        <Typography
          variant="caption"
          gutterBottom={true}
          align="left"
          display="block"
        >
          {`${fileSize} ${fileTypeDescription}`}
        </Typography>
      </div>
      {deleteButtonRenderer}
      {isUploading && isUploadingRenderer()}
    </div>
  );
};

export default AttachmentIconPresenter;
