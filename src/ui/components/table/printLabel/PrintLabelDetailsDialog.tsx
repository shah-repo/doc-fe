import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { range } from 'lodash';
import React from 'react';
import { FBLabel } from '../../../form.builder';
import { Autocomplete, FormField, TextField } from '../../forms/fields-next';
import Datepicker from '../../forms/fields-next/Datepicker/Datepicker';
import { SelectOption } from '../../forms/fields/Select';
import Text from '../../Text';
import { labelPropsStyle, styles } from '../styles';
import { PrintLabelDetailsDialogProps } from './PrintLabelDetailsDialog.types';
import { withPrintLabelDetailsDialog } from './PrintLabelDetailsDialog.wrap';

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
  selectedNumberOfLabel,
}) => {
  const classes = styles();

  const qtyUnitsRender = () => {
    const gridSize = selectedNumberOfLabel < 5 ? (12 / selectedNumberOfLabel) : 3;
    return (qtyUnits.map((item, i) => (
      <Grid item xs={gridSize} key={i} >
        <FormField label="print.label.dialog.field.quantity.units" />
        <FormField label={`(Label ${i + 1})`} >
          <TextField
            type="number"
            value={item}
            onChange={e => onQtyUnitsChange(e, i)} />
        </FormField>
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
            <FormField label="print.label.dialog.field.partId">
              <TextField disabled value={initialValues?.partId} />
            </FormField>
          </Grid>
          <Grid item xs={4}>
            <FormField label="print.label.dialog.field.revision">
              <TextField disabled value={initialValues?.revision} />
            </FormField>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex">
              <FormField label="print.label.dialog.field.description" fullWidth={false} />
              <FBLabel label="print.label.dialog.field.description.info"
                fontSize="12px"
                labelProps={labelPropsStyle} />
            </Box>
            <TextField
              value={description.slice(0, 90)}
              onChange={onDescriptionChange} />
          </Grid>
          <Grid item xs={6}>
            <FormField label="print.label.dialog.field.lot">
              <TextField disabled value={initialValues?.lotId} />
            </FormField>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex">
              <FormField label="print.label.dialog.field.serial" fullWidth={false} />
              <FBLabel label="print.label.dialog.field.serial.info"
                fontSize="12px"
                labelProps={labelPropsStyle} />
            </Box>
            <TextField
              onChange={onSerialChange}
              value={serial.slice(0, 14)} />
          </Grid>
          <Grid item xs={6}>
            <FormField label="print.label.dialog.field.by">
              <Autocomplete
                value={selectedOption}
                options={companyEmployees}
                getOptionLabel={(option) => `${option.text} (${option.email})`}
                onChange={(e, value: SelectOption) => setSelectedOption(value)}
              />
            </FormField>
          </Grid>
          <Grid item xs={6} >
            <FormField label="print.label.dialog.field.date">
              <Datepicker
                value={selectedDate}
                size="medium"
                onChange={handleDateChange}
              />
            </FormField>
          </Grid>
          <Grid item xs={12}>
            <FormField label="print.label.dialog.field.number.of.labels">
              <Autocomplete
                disableClearable
                value={selectedNumberOfLabel}
                options={range(1, 10, 1)}
                getOptionLabel={(option) => typeof (option) == 'number' ? String(option) : option}
                onChange={(e, value: Number) => onNumberOfLabelChange(value)} />
            </FormField>
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
