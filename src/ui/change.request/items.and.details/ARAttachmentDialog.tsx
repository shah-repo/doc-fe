// import { Grid } from '@material-ui/core';
import React from 'react';
import { Attachment } from '../../../state/ducks/attachments/types';
// import AttachmentIconPresenter from '../../components/common/attachment.icon/presenter';
import AttachmentField from '../../../ui/components/common/attachment.icon/container';
import { Dialog } from '../../components/dialogs/index';
import { DialogHandler } from '../../hooks/useDialog';
import useStyles from './dialog.styles';

interface Props {
  title: string
  loading: boolean
  handler: DialogHandler
  attachments: Attachment[]
}

const ARAttachmentDialog: React.FC<Props> = ({
  title,
  handler,
  loading,
  attachments,
}) => {
  const classes = useStyles();
  const closeDialog = () => {
    handler.close();
  };
  return (
    <Dialog
      className={classes.dialog}
      title={title}
      open={handler.isOpen}
      loading={loading}
      confirmProps={{
        disabled: loading,
      }}
      onClose={closeDialog}
    >
      <AttachmentField
        value={attachments}
        name="attachments"
      />
    </Dialog>
  );
};

export default ARAttachmentDialog;
