import { Dialog } from '@material-ui/core';
import React from 'react';
import { TrainingRecordQuery } from '../../../state/ducks/training/types';
import { DialogHandler } from '../../hooks/useDialog';
import TrainingDetails from './TrainingDetails';
import { styles } from './styles';

interface Props {
  dialog: DialogHandler
  training: TrainingRecordQuery
}

const TrainingDialog: React.FunctionComponent<Props> = (props) => {
  const { dialog, training } = props;

  const classes = styles();

  if (!dialog.isOpen) {
    return null;
  }

  console.log('New Training Dialog...');

  return (
    <Dialog
      open={dialog.isOpen}
      classes={{ paper: classes.dialogContent }}
      fullWidth
      maxWidth="md"
      onEscapeKeyDown={dialog.close}
      onBackdropClick={dialog.close}
    >
      <TrainingDetails
        dialog={dialog}
        training={training}
      />
    </Dialog>
  );
};

export default TrainingDialog;
