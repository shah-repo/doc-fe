import { Box, List, ListItem } from '@material-ui/core';
import React from 'react';
import { DialogHandler } from '../../../../hooks/useDialog';
import Dialog from '../../../dialogs/Dialog';
import { DialogCloseReason } from '../../../dialogs/Dialog.types';
import ScanLotTable from './components/lot.table';
import useStyles from './styles';

interface Props {
  children?: JSX.Element
  handler: DialogHandler
  onConfirm?: (event: React.MouseEvent<HTMLElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose?: (event: {}, reason: DialogCloseReason) => void
}

const ScanCaptureDialog: React.FC<Props> = ({ handler, onConfirm, children, onCancel, onClose }) => {
  const classes = useStyles();

  const keyValues = [
    { key: 'Item ID', value: 'FG-00100' },
    { key: 'Part Description', value: 'Sample Desc' },
    { key: 'Qty Needed', value: 20 },
    { key: 'Variance', value: 12 },
  ];

  return (
    <Dialog
      className={classes.root}
      open={handler?.isOpen}
      hideCloseButton={false}
      // loading={loading}
      cancelLabel="common.cancel"
      title="scan.lot.dialog.title.message"
      confirmLabel="common.add"
      confirmProps={{
        id: 'dialog-add',
        'data-cy': 'dialog-add',
        // disabled: loading,
      }}
      cancelProps={{
        id: 'dialog-cancel',
        'data-cy': 'dialog-cancel',
      }}
      PaperProps={{
        id: 'dialog',
      }}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Box className={classes.contentWrapper}>
        <List>
          {keyValues?.map((item, index) => (
            <ListItem key={index} disableGutters>
              <div className={classes.row}>
                <span className={classes.key}>{item.key}:</span>
                <span className={classes.value}>{item.value}</span>
              </div>
            </ListItem>
          ))}
        </List>
        <ScanLotTable />
      </Box>
    </Dialog>
  );
};

export default ScanCaptureDialog;
