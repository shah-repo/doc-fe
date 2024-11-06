import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';
import { ISelectedDetails } from './interface';

const MigrationConfirmationDialog: React.FC<{
  isOpen: boolean
  handleClose: () => void
  handleConfirmation: () => void
  selectedDetails: ISelectedDetails[]
}> = ({ isOpen, handleClose, selectedDetails, handleConfirmation }) => {
  const actionCountMap: {[key: string]: number} = {};
  selectedDetails.forEach(detail => {
    if (!actionCountMap[detail.action]) {
      actionCountMap[detail.action] = 0;
    }
    actionCountMap[detail.action] += 1;
  });

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Supplier Revisions Migration Summary</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="h5" style={{ marginBottom: '8px' }}>{selectedDetails.length} Supplier revisions selected</Typography>
          { Object.keys(actionCountMap).map(key => {
            return <Typography variant="subtitle2">{key} - {actionCountMap[key]} revisions</Typography>;
          })}
          <Typography variant="body2" style={{ marginTop: '16px' }}>
            This will fire a <b>JOB request</b>, which might take 10 mins or more, depending on the network congestion.
          </Typography>
          <p>Are you sure you want to revise these Suppliers?</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClose} color="primary">
            Cancel
        </Button>
        <Button onClick={handleConfirmation} color="primary" autoFocus>
            Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MigrationConfirmationDialog;
