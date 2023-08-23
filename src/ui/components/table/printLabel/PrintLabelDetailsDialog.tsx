import { Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { FBAutocomplete, FBLabel, FBTextField } from '../../../form.builder';
import Text from '../../Text';
import { styles } from '../styles';
import { PrintLabelDetailsDialogProps } from './PrintLabelDetailsDialog.types';
import { withPrintLabelDetailsDialog } from './PrintLabelDetailsDialog.wrap';

const PrintLabelDetailsDialog: React.FC<PrintLabelDetailsDialogProps> = () => {
  // const companyEmployes = useSelector(companySelectors.getActiveEmployees);

	const classes = styles();
	return (
		<Dialog open={true} fullWidth={true} maxWidth="sm">
			<DialogTitle disableTypography className={classes.dialogTitle}>
			<Typography variant="h6"><Text translation="change.owner" /></Typography>
			<IconButton className={classes.closeIcon} data-cy="change-owner-close-icon">
          <CloseIcon />
        </IconButton>
			</DialogTitle>
			<Divider />
			<DialogContent>
				<Grid
				container
				alignItems="center"
        justify="space-between"
        spacing={2}>
<Grid item xs={8}>
	<>
	<FBLabel label="Part ID" />
	<FBTextField disabled defaultValue="testing" value="testing" />
	</>
	</Grid>
<Grid item xs={4}>
<>
	<FBLabel label="Revision" />
	<FBTextField disabled defaultValue="testing" value="testing" />
	</>
</Grid>
<Grid item xs={12}>
<>
	<FBLabel label="Description" />
	<FBTextField disabled defaultValue="testing" value="testing" />
	</>
</Grid>
<Grid item xs={6}>
<>
	<FBLabel label="Lot" />
	<FBTextField disabled defaultValue="testing" value="testing" />
	</>
</Grid>
<Grid item xs={6}>
<>
	<FBLabel label="Serial" />
	<FBTextField defaultValue="testing" value="testing" />
	</>
</Grid>
<Grid item xs={12}>
<>
	<FBLabel label="By" />
	<FBAutocomplete
	defaultValue="testing"
	options={[]}
	/>
	</>
</Grid>
<Grid item xs={6}>
<>
	<FBLabel label="Quantity Units" />
	<FBTextField defaultValue="testing" value="testing" />
	</>
</Grid>
<Grid item xs={6}>
<>
	<FBLabel label="Date" />
	{/* <DatePickerField
            name="dueDate"
            label="common.due.date"
            size="sm"
            datePickerProps={{ id: 'dueDate', minDate: toStartOfDay(undefined) }}
            validate={validator(required)}
          /> */}
	<FBTextField defaultValue="testing" value="testing" />
	</>
</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
};

export default withPrintLabelDetailsDialog(PrintLabelDetailsDialog);
