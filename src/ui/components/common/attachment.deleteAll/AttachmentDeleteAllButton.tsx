import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import Colors from '../../../layout/theme-next/colors';

interface Props {
  isAttachmentEmpty: boolean
  selectedAttachments: {[id: string]: boolean | number[]}
  documentRevision: DocumentRevision
  onSelectedAttachmentsChange: (selectedAttachments: {[id: string]: boolean | number[]}) => void
  onHeaderCheck: (value: boolean) => void
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      verticalAlign: 'middle',
      maxHeight: 20,
      maxWidth: 20,
    },
    deleteButton: {
      padding: 0,
      marginLeft: theme.spacing(1.5),
    },
    deleteIcon: {
      color: Colors.reject,
      height: 20,
      width: 20,
    },
  }));

const AttachmentDeleteAllButton: React.FunctionComponent<Props> = ({
  isAttachmentEmpty,
  selectedAttachments,
  documentRevision,
  onSelectedAttachmentsChange,
  onHeaderCheck,
}) => {
  const { getFieldProps, setFieldValue, submitForm } = useFormikContext();
  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);
  const selectedAttachmentsCount = Object.values(selectedAttachments).filter(value => value === true).length;
  const selectedAttachmentsData = selectedAttachments && Object.keys(selectedAttachments).filter(key => selectedAttachments[key]);
  const classes = styles({ isAttachmentEmpty });
  const deleteAttachmentsAction = useActionCreator(documentRevisionsActions.save);
  const attachments = documentRevision?.attachments ?? getFieldProps('attachments').value;
  const async = useAsync<DocumentRevision>({
    onSuccess: () => {
      onSelectedAttachmentsChange({});
      onHeaderCheck(false);
      setIsDownloading(false);
    },
    onError: () => {
      setIsDownloading(false);
    },
  });

  const handleDelete = () => {
    const filtered = !selectedAttachmentsCount
      ? []
      : attachments?.filter((item) => !selectedAttachmentsData.includes(item.id));

    if (documentRevision?.id) {
      setIsDownloading(true);
      async.start(
        deleteAttachmentsAction,
        documentRevision?.id,
        { attachments: filtered },
        async,
      );
    } else {
      setFieldValue('attachments', filtered);
      submitForm();
      onSelectedAttachmentsChange({});
      onHeaderCheck(false);
    }
  };

  const toolTipText = selectedAttachmentsCount === 0 || selectedAttachmentsCount === attachments?.length ? 'common.delete.all.files' : 'common.delete.selected.files';

  if (isEmpty(attachments)) {
    return null;
  }

  return (
    <Tooltip title={translate(toolTipText)}>
      <IconButton
        className={classes.deleteButton}
        onClick={() => handleDelete()}
      >
        {isDownloading
          ? <CircularProgress className={classes.icon} />
          : <FontAwesomeIcon icon={regular('trash-can')} className={classes.deleteIcon} />
        }
      </IconButton>
    </Tooltip>
  );
};

export default AttachmentDeleteAllButton;
