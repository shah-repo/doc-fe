import { Box, Divider, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { companySelectors } from '../../../state/ducks/company';
import { ApplicationState } from '../../../state/reducers';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import Text from '../../components/Text';
import { FBButton, FBLabel } from '../../form.builder';
import PrintingContainer from './printing/Printing.container';
import { GeneralSettingsTabs } from './tabs.types';

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
			// style={{  }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

const GeneralSettingsPresenter: React.FunctionComponent<T> = (categoryName) => {
	const classes = KendoGridStyles();
	const [value, setValue] = React.useState(GeneralSettingsTabs.Printing);
	const title = useSelector((state: ApplicationState) => companySelectors.getNavigationTitle(state, categoryName));

	const handleChange = (event: React.SyntheticEvent, newValue) => {
		console.log('---newValue---', { newValue });
    setValue(newValue);
  };

	return (
		<Grid container >
			<Grid container xs={12} className={classes.headerGridItem}>
			<Grid item xs={8} >
				<FBLabel label={{
            locale: 'administration.generalsettings.title',
            // values: { number: stepIndex },
          }}
					fontSize={21} />
			<Text translation="administration.generalsettings.sub.title" />
			</Grid>
			<Grid item xs={4} style={{ display: 'flex', justifyContent: 'end' }}>
			<FBButton
			label="common.save.changes"
			variant="contained" />
			</Grid>
			</Grid>
			<Grid item lg={12} >
				<Divider style={{ margin: '0px 32px 0px 28px' }} />
			<Box
      padding={4}
			display="flex"
			flexGrow={1}
    >
			<Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab
				value={GeneralSettingsTabs.Printing}
				label={GeneralSettingsTabs.Printing}
				{...a11yProps(0)}
				style={{ textAlign: 'left', backgroundColor: '#EDF3FF' }} />
        <Tab
				value={GeneralSettingsTabs.AccountCodes}
				label={GeneralSettingsTabs.AccountCodes}
				{...a11yProps(1)} />
        <Tab
				value={GeneralSettingsTabs.Navigation}
				label={GeneralSettingsTabs.Navigation}
				{...a11yProps(2)} />
				<Tab
				value={GeneralSettingsTabs.APITokens}
				label={GeneralSettingsTabs.APITokens}
				{...a11yProps(3)} />
      </Tabs>
			{value === GeneralSettingsTabs.Printing && <PrintingContainer />}
			</Box>
			</Grid>
		</Grid>
	);
};

export default GeneralSettingsPresenter;
