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

const PrintLabelDetailsDialog: React.FC<PrintLabelDetailsDialogProps> = ({
  setSelectedOption,
  closeDialog,
  onQtyUnitsChange,
  onLabelsToPrintChange,
  onSerialChange,
  onPrintClick,
  onDescriptionChange,
  isOpen,
  companyEmployees,
  selectedOption,
  handleDateChange,
  selectedDate,
  initialValues,
  labelsToPrint,
  qtyUnits,
  serial,
  description,
}) => {
  const classes = styles();

  const qtyUnitsRender = () => {
    const gridSize = labelsToPrint < 5 ? (12 / labelsToPrint) : 3;
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
              <FBLabel label="Serial" />
              <TextField
                onChange={onSerialChange}
                value={serial} />
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
              <TextField
                type="number"
                value={labelsToPrint}
                onChange={(ev) => onLabelsToPrintChange(ev)} />
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
