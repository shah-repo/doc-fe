import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { get, includes, range } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { companySelectors } from '../../../../state/ducks/company';
import { LabelTemplatesProps, ZebraPrintSettings } from '../../../../state/ducks/company/types';
import { FBLabel } from '../../../form.builder';
import Text from '../../Text';
import { Autocomplete, FormField, TextField } from '../../forms/fields-next';
import Datepicker from '../../forms/fields-next/Datepicker/Datepicker';
import { labelPropsStyle, qtyLabelStyle, styles } from '../styles';
import { PrintLabelDetailsDialogProps } from './PrintLabelDetailsDialog.types';
import { withPrintLabelDetailsDialog } from './PrintLabelDetailsDialog.wrap';

const gridMaxWidth = 920;

const PrintLabelDetailsDialog: React.FC<PrintLabelDetailsDialogProps> = ({
  onActorChange,
  closeDialog,
  onQtyUnitsChange,
  onSerialChange,
  onPrintClick,
  onDescriptionChange,
  onNumberOfLabelChange,
  onPrinterChange,
  onLabelTypeChange,
  onFieldCheck,
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
  selectedParams,
  labelTypeData,
}) => {
  const classes = styles();
  const { zebraPrint } = useSelector(companySelectors.getGeneralSettings); console.log('---initialValues--', { zebraPrint }, get(zebraPrint, 'printer.name'));
  const qtyUnitsRender = () => {
    const gridSize = selectedNumberOfLabel < 6 ? (gridMaxWidth / selectedNumberOfLabel) : (gridMaxWidth / 5);
    const qtyClasses = qtyLabelStyle(gridSize);
    return (qtyUnits.map((item, i) => (
      <Grid item key={i} className={qtyClasses.qtyLabel} >
        <FormField label="print.label.dialog.field.quantity.units" />
        <FormField data-cy={`label-count-${i}`} label={`(Label ${i + 1})`} >
          <TextField
            type="number"
            data-cy="quantity-units"
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
        <IconButton className={classes.closeIcon} data-cy="close-icon" onClick={closeDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        <Grid
          container
          alignItems="center"
          spacing={2} >
          <Grid item xs={6}>
            <FormField label="print.label.dialog.field.printer">
              <Autocomplete
                disableClearable
                data-cy="printer-name"
                options={zebraPrint}
                getOptionLabel={(option: ZebraPrintSettings) => option.printer?.name}
                onChange={onPrinterChange} />
            </FormField>
          </Grid>
          <Grid item xs={6}>
            <FormField label="print.label.dialog.field.label.type">
              <Autocomplete
                disableClearable
                data-cy="label-type"
                options={labelTypeData}
                getOptionLabel={(option: LabelTemplatesProps) => option?.name}
                onChange={onLabelTypeChange} />
            </FormField>
          </Grid>
          <Grid item xs={8}>
            <FormField label="print.label.dialog.field.partId" {...{ onFieldCheck }}
              checkboxName="partDocId"
              checked={includes(selectedParams, 'partDocId')}>
              <TextField
                disabled
                value={initialValues?.partId}
                data-cy="part-id" />
            </FormField>
          </Grid>
          <Grid item xs={4}>
            <FormField label="print.label.dialog.field.revision" {...{ onFieldCheck }}
              checkboxName="revision"
              checked={includes(selectedParams, 'revision')}>
              <TextField
                disabled
                value={initialValues?.revision}
                data-cy="revision" />
            </FormField>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex">
              <FormField label="print.label.dialog.field.description" fullWidth={false} {...{ onFieldCheck }}
                checkboxName="description"
                checked={includes(selectedParams, 'description')} />
              <FBLabel label="print.label.dialog.field.description.info"
                fontSize="12px"
                labelProps={labelPropsStyle} />
            </Box>
            <TextField
              value={description.slice(0, 90)}
              data-cy="description"
              onChange={onDescriptionChange} />
          </Grid>
          <Grid item xs={6}>
            <FormField label="print.label.dialog.field.lot" {...{ onFieldCheck }}
              checkboxName="lotNumber"
              checked={includes(selectedParams, 'lotNumber')}>
              <TextField
                disabled
                value={initialValues?.lotId}
                data-cy="lot" />
            </FormField>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex">
              <FormField label="print.label.dialog.field.serial" fullWidth={false} {...{ onFieldCheck }}
                checkboxName="serial"
                checked={includes(selectedParams, 'serial')} />
              <FBLabel label="print.label.dialog.field.serial.info"
                fontSize="12px"
                labelProps={labelPropsStyle} />
            </Box>
            <TextField
              data-cy="serial"
              onChange={onSerialChange}
              value={serial.slice(0, 14)} />
          </Grid>
          <Grid item xs={6}>
            <FormField label="print.label.dialog.field.by" {...{ onFieldCheck }}
              checkboxName="actor"
              checked={includes(selectedParams, 'actor')}>
              <Autocomplete
                freeSolo
                value={selectedOption}
                data-cy="by"
                options={companyEmployees}
                getOptionLabel={(option) => option?.text ? `${option.text} (${option.email})` : option}
                onChange={onActorChange}
                onInputChange={onActorChange}
              />
            </FormField>
          </Grid>
          <Grid item xs={6} >
            <FormField label="print.label.dialog.field.date" {...{ onFieldCheck }}
              checkboxName="printDate"
              checked={includes(selectedParams, 'printDate')}>
              <Datepicker
                value={selectedDate}
                data-cy="date"
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
                data-cy="number-of-labels"
                options={range(1, 11, 1)}
                getOptionLabel={(option) => typeof (option) === 'number' ? String(option) : option}
                onChange={(e, value: number) => onNumberOfLabelChange(value)} />
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
          id="printCancelButton"
          data-cy="print-cancel-button"
        >
          <Text translation="document.action.cancel" />
        </Button>
        <Button
          variant="outlined"
          className={classes.printButton}
          onClick={onPrintClick}
          id="printButton"
          data-cy="print-button"
        >
          <Text translation="common.print" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withPrintLabelDetailsDialog(PrintLabelDetailsDialog);
