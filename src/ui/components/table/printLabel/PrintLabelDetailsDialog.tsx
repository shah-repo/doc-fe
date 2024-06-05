import { Box, Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { includes, isEmpty, range } from 'lodash';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { companySelectors } from '../../../../state/ducks/company';
import { LabelTemplatesProps, ZebraPrintSettings } from '../../../../state/ducks/company/types';
import { FBLabel } from '../../../form.builder';
import { Autocomplete, Checkbox, FormField, TextField } from '../../forms/fields-next';
import Datepicker from '../../forms/fields-next/Datepicker/Datepicker';
import Text from '../../Text';
import { labelPropsStyle, qtyLabelStyle, styles } from '../styles';
import { PrintLabelDetailsDialogProps } from './PrintLabelDetailsDialog.types';
import { PRINTER_LABEL_TYPE_KEY, PRINTER_NAME_KEY, withPrintLabelDetailsDialog } from './PrintLabelDetailsDialog.wrap';

const gridMaxWidth = 920;
const PH_PRINT_LABEL_TYPE = '4x1.5" (300 DPI)';
const phCheck = 'ph';
const useStyle = makeStyles(theme => createStyles({
  checkBoxField: {
    margin: theme.spacing(0, 1, 0, 0),
  },
}));

interface FieldCheckboxProps {
  label: string
  checked: boolean
  checkboxName: string
  onFieldCheck: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void
  fullWidth?: boolean
  children?: React.ReactNode
  className?: string
}

const FieldCheckbox: React.FC<FieldCheckboxProps> = ({ className, label, checked, checkboxName, onFieldCheck, fullWidth = true, children }) => {
  const style = useStyle();
  return (
    <FormField {...{ fullWidth }} label={<Box className={className} >
      <Checkbox className={style.checkBoxField} {...{ checked }} name={checkboxName} onChange={onFieldCheck} />
      <>{translate(label)}</>
    </Box>}>{children}</FormField>
  );
};

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
  printerSerial,
  labelTemplate,
  showError,
}) => {
  const classes = styles();
  const { zebraPrint } = useSelector(companySelectors.getGeneralSettings);
  const printerValue: ZebraPrintSettings = JSON.parse(localStorage.getItem(PRINTER_NAME_KEY));
  const isRecentPrinterExist = zebraPrint?.find(item => item.printer.name === printerValue?.printer?.name && item.printer.isActive);
  const recentPrinterLabelType = localStorage.getItem(PRINTER_LABEL_TYPE_KEY);
  const defaultLabelType = isRecentPrinterExist ? JSON.parse(recentPrinterLabelType) : '';
  const isShowpH = defaultLabelType?.name === PH_PRINT_LABEL_TYPE;
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
            <FormField label="print.label.dialog.field.printer"
              required
              error={isEmpty(printerSerial) && showError}
              helperText={isEmpty(printerSerial) && showError ? translate('validators.required') : ''}>
              <Autocomplete
                defaultValue={isRecentPrinterExist ? printerValue : ''}
                disableClearable
                data-cy="printer-name"
                options={zebraPrint?.filter(item => item.printer.isActive)}
                getOptionLabel={(option: ZebraPrintSettings) => option.printer?.name}
                onChange={onPrinterChange} />
            </FormField>
          </Grid>
          <Grid item xs={6}>
            <FormField label="print.label.dialog.field.label.type"
              required
              error={isEmpty(labelTemplate) && showError}
              helperText={isEmpty(labelTemplate) && showError ? translate('validators.required') : ''}>
              <Autocomplete
                defaultValue={defaultLabelType}
                disableClearable
                data-cy="label-type"
                options={labelTypeData}
                getOptionLabel={(option: LabelTemplatesProps) => option?.name}
                onChange={onLabelTypeChange} />
            </FormField>
          </Grid>
          <Grid item xs={8}>
            <FieldCheckbox label="print.label.dialog.field.partId" {...{ onFieldCheck }}
              checkboxName="partDocId"
              checked={includes(selectedParams, 'partDocId')}>
              <TextField
                disabled
                value={initialValues?.partId}
                data-cy="part-id" />
            </FieldCheckbox>
          </Grid>
          <Grid item xs={4}>
            <FieldCheckbox label="print.label.dialog.field.revision" {...{ onFieldCheck }}
              checkboxName="revision"
              checked={includes(selectedParams, 'revision')}>
              <TextField
                disabled
                value={initialValues?.revision}
                data-cy="revision" />
            </FieldCheckbox>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <FieldCheckbox label="print.label.dialog.field.description" fullWidth={false} {...{ onFieldCheck }}
                checkboxName="description"
                checked={includes(selectedParams, 'description')} />
              <FBLabel label="print.label.dialog.field.description.info"
                fontSize="12px"
                labelProps={labelPropsStyle} />
            </Box>
            <TextField
              value={description?.slice(0, 90)}
              data-cy="description"
              onChange={onDescriptionChange} />
          </Grid>
          <Grid item xs={6}>
            <FieldCheckbox label="print.label.dialog.field.lot" {...{ onFieldCheck }}
              checkboxName="lotNumber"
              checked={includes(selectedParams, 'lotNumber')}>
              <TextField
                disabled
                value={initialValues?.lotId}
                data-cy="lot" />
            </FieldCheckbox>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <FieldCheckbox label="print.label.dialog.field.serial" fullWidth={false} {...{ onFieldCheck }}
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
            <FieldCheckbox label="print.label.dialog.field.by" {...{ onFieldCheck }}
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
            </FieldCheckbox>
          </Grid>
          <Grid item xs={6} >
            <FieldCheckbox label="print.label.dialog.field.date" {...{ onFieldCheck }}
              checkboxName="printDate"
              checked={includes(selectedParams, 'printDate')}>
              <Datepicker
                value={selectedDate}
                data-cy="date"
                size="medium"
                onChange={handleDateChange}
              />
            </FieldCheckbox>
          </Grid>
          <Grid item xs={isShowpH ? 6 : 12}>
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
          {isShowpH && (
            <Grid item xs={6}>
              <FieldCheckbox className={classes.pHCheckbox} label="common.pH" {...{ onFieldCheck }}
                checkboxName="ph"
                checked={includes(selectedParams, phCheck)} />
            </Grid>
          )}
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
