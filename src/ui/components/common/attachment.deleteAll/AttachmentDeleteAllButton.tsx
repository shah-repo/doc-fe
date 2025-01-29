import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createStyles, IconButton, makeStyles, Theme, Tooltip, CircularProgress } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import Colors from '../../../layout/theme/utils/colors';

interface Props {
  isAttachmentEmpty: boolean
  selectedAttachments: {[id: string]: boolean | number[]}
  documentRevision: DocumentRevision
  onSelectedAttachmentsChange: (selectedAttachments: {[id: string]: boolean | number[]}) => void
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      verticalAlign: 'middle',
      maxHeight: '20px',
      maxWidth: '20px',
    },
    deleteButton: {
      padding: 0,
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    deleteIcon: {
      color: Colors.red,
      height: 17,
      width: 17,
    },
  }));

const AttachmentDeleteAllButton: React.FunctionComponent<Props> = ({
  isAttachmentEmpty,
  selectedAttachments,
  documentRevision,
  onSelectedAttachmentsChange,
}) => {
  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);
  const selectedAttachmentsCount = Object.values(selectedAttachments).filter(value => value === true).length;
  const selectedAttachmentsData = selectedAttachments && Object.keys(selectedAttachments).filter(key => selectedAttachments[key]);
  const classes = styles({ isAttachmentEmpty });
  const deleteAttachmentsAction = useActionCreator(documentRevisionsActions.save);
  const async = useAsync<DocumentRevision>({
    onSuccess: () => {
      onSelectedAttachmentsChange({});
      setIsDownloading(false);
    },
    onError: () => {
      setIsDownloading(false);
    },
  });

  const handleDelete = () => {
    const filtered = documentRevision?.attachments?.filter((item) => !selectedAttachmentsData.includes(item.id));
    setIsDownloading(true);
    async.start(
      deleteAttachmentsAction,
      documentRevision.id,
      { attachments: filtered },
      async,
    );
  };

  const toolTipText = selectedAttachmentsCount === 0 || selectedAttachmentsCount === documentRevision.attachments.length ? 'common.delete.all.files' : 'common.delete.selected.files';

  if(isEmpty(documentRevision.attachments)) {
    return null;
  }

  return (
    <Tooltip title={translate(toolTipText)}>
      <IconButton onClick={() => handleDelete()} className={classes.deleteButton}>
      {isDownloading ? <CircularProgress className={classes.icon} /> : <FontAwesomeIcon icon={regular('trash-can')} className={classes.deleteIcon} />}
      </IconButton>
    </Tooltip>
  );
};

export default AttachmentDeleteAllButton;
