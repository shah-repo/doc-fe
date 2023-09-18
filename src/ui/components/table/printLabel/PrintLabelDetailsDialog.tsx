import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { FBLabel } from '../../../form.builder';
import { Autocomplete, TextField } from '../../forms/fields-next';
import Datepicker from '../../forms/fields-next/Datepicker/Datepicker';
import { SelectOption } from '../../forms/fields/Select';
import Text from '../../Text';
import { styles } from '../styles';
import { PrintLabelDetailsDialogProps } from './PrintLabelDetailsDialog.types';
import { withPrintLabelDetailsDialog } from './PrintLabelDetailsDialog.wrap';

const NumbersOfLabelsOption = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ];

const PrintLabelDetailsDialog: React.FC<PrintLabelDetailsDialogProps> = ({
  setSelectedOption,
  closeDialog,
  onQtyUnitsChange,
  onSerialChange,
  onPrintClick,
  onDescriptionChange,
  onNumberOfLabelChange,
  isOpen,
  companyEmployees,
  selectedOption,
  handleDateChange,
  selectedDate,
  initialValues,
  qtyUnits,
  serial,
  description,
  selectedNumberOfLabel
}) => {
  const classes = styles();

  const qtyUnitsRender = () => {
    const gridSize = Number(selectedNumberOfLabel) < 5 ? (12 / Number(selectedNumberOfLabel)) : 3;
    return (qtyUnits.map((item, i) => (
      <Grid item xs={gridSize} key={i} >
        <>
          <FBLabel label="Quantity Units" />
          <FBLabel label={`(Label ${i + 1})`} />
          <TextField
            type="number"
            value={item}
            onChange={e => onQtyUnitsChange(e, i)} />
        </>
      </Grid>
    )));
  };

  return (
    <Dialog open={isOpen} fullWidth={true} maxWidth="md" >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <Typography variant="h6"><Text translation="common.print" /></Typography>
        <IconButton className={classes.closeIcon} data-cy="change-owner-close-icon" onClick={closeDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          spacing={2} >
          <Grid item xs={8}>
            <>
              <FBLabel label="Part ID" />
              <TextField disabled value={initialValues?.partId} />
            </>
          </Grid>
          <Grid item xs={4}>
            <>
              <FBLabel label="Revision" />
              <TextField disabled value={initialValues?.revision} />
            </>
          </Grid>
          <Grid item xs={12}>
            <>
              <Box display="flex">
                <FBLabel label="Description" />
                <FBLabel label="(90 characters max)"
                  fontSize="14px"
                  labelProps={{ color: 'grey', display: 'flex', alignItems: 'center', marginLeft: '10px' }} />
              </Box>
              <TextField
                value={description.slice(0, 90)}
                onChange={onDescriptionChange} />
            </>
          </Grid>
          <Grid item xs={6}>
            <>
              <FBLabel label="Lot" />
              <TextField disabled value={initialValues?.lotId} />
            </>
          </Grid>
          <Grid item xs={6}>
            <>
             <Box display="flex">
                <FBLabel label="Serial" />
                <FBLabel label="(14 characters max)"
                  fontSize="14px"
                  labelProps={{ color: 'grey', display: 'flex', alignItems: 'center', marginLeft: '10px' }} />
              </Box>
              <TextField
                onChange={onSerialChange}
                value={serial.slice(0, 14)} />
            </>
          </Grid>
          <Grid item xs={6}>
            <>
              <FBLabel label="By" />
              <Autocomplete
                value={selectedOption}
                options={companyEmployees}
                getOptionLabel={(option) => `${option.text} (${option.email})`}
                onChange={(e, value: SelectOption) => setSelectedOption(value)}
              />
            </>
          </Grid>
          <Grid item xs={6} >
            <>
              <FBLabel label="Date" />
              <Datepicker
                value={selectedDate}
                size="medium"
                onChange={handleDateChange}
              />
            </>
          </Grid>
          <Grid item xs={12}>
            <>
              <FBLabel label="Number of Labels to Print" />
              <Autocomplete
                value={selectedNumberOfLabel}
                options={NumbersOfLabelsOption}
                renderInput={(params) => <TextField {...params} label="Controllable" />}
                onChange={(e, value: string) => onNumberOfLabelChange(value)} />
            </>
          </Grid>
          {qtyUnitsRender()}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button
          variant="outlined"
          className={classes.clearButton}
          onClick={closeDialog}
          id="printButton"
          data-cy="printButton"
        >
          <Text translation="document.action.cancel" />
        </Button>
        <Button
          variant="outlined"
          className={classes.printButton}
          onClick={onPrintClick}
          id="printButton"
          data-cy="printButton"
        >
          <Text translation="common.print" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withPrintLabelDetailsDialog(PrintLabelDetailsDialog);
