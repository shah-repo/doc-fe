import { Box, LinearProgress, MenuItem, MenuList, Typography, makeStyles } from '@material-ui/core';
import { remove } from 'lodash';
import React, { useState } from 'react';
import { translate } from '../../../common/intl';
import { AsyncState, AsyncStatus } from '../../../state/types';
import { Button } from '../../components/forms/fields-next';
import { Colors, withThemeNext } from '../../layout/theme-next';
import { GeneralSettingsTabs } from './GeneralSettings.types';
import HeaderLastSaved from './components/HeaderLastSaved';
import ApprovalRequestsSettingsPanel from './panels/ApprovalRequest';
import PrintingSettingsPanel from './panels/Printing';

const panels = [
  {
    key: GeneralSettingsTabs.Printing,
    title: 'administration.general.settings.printing',
    component: PrintingSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.AR,
    title: 'administration.general.settings.ar',
    component: ApprovalRequestsSettingsPanel,
  },
];

const SIDEBAR_WIDTH = 150;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridGap: theme.spacing(2.5, 3),
    padding: theme.spacing(3, 3, 0),
    gridTemplate: `min-content min-content auto / ${SIDEBAR_WIDTH}px auto`,
  },
  header: {
    gridArea: '1 / 1 / 2 / 3',
    borderBottom: `1px solid ${Colors.stroke}`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(2.5),
  },
  title: {
    fontSize: 21,
    color: Colors.textBlack,
  },
  subtitle: {
    color: Colors.textGray,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    whiteSpace: 'nowrap',
    flexWrap: 'wrap',
    gap: theme.spacing(1, 1.25),
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5, 1.25),
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebar: {
    gridArea: '2 / 1 / 4 / 2',
    paddingBottom: theme.spacing(3),
  },
  listItem: {
    borderRadius: 4,
    padding: theme.spacing(1, 1.25),
    marginBottom: theme.spacing(0.5),
    color: Colors.textGray,
    fontSize: 12,
    minHeight: 0,

    '&.Mui-selected': {
      backgroundColor: Colors.primaryBg,
      color: Colors.primaryDark,
      fontWeight: 600,

      '&:hover': {
        backgroundColor: Colors.primaryBg,
      },
    },
    '&:hover': {
      backgroundColor: Colors.primaryBg,
    },
  },
  panels: {
    gridArea: '3 / 2 / 4 / 3',
    overflow: 'auto',
    paddingBottom: theme.spacing(3),
  },
  toggler: {
    gridArea: '2 / 2 / 3 / 3',
  },
}));

interface Props {
  asyncState: AsyncState
  updatedAt?: string
  onSave: () => void
}

const GeneralSettingsPresenter: React.FC<Props> = ({
  updatedAt,
  asyncState,
  onSave,
}) => {
  const classes = useStyles();

  const isLoading = asyncState.status === AsyncStatus.Active;

  const [expandedPanels, setExpanedPanels] = useState<GeneralSettingsTabs[]>([GeneralSettingsTabs.AR]);
  const allPanelsExpaned = expandedPanels.length === panels.length;

  const toggleAllPanels = () => setExpanedPanels(allPanelsExpaned ? [] : panels.map(panel => panel.key));
  const togglePanel = (key: GeneralSettingsTabs) => () => setExpanedPanels(state => (
    state.includes(key) ? remove(state, key) : [...state, key]
  ));
  const jumpToPanel = (key: GeneralSettingsTabs) => () => setExpanedPanels([key]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box>
          <Typography
            variant="h1"
            className={classes.title}
          >
            {translate('administration.general.settings.title')}
          </Typography>
          <Typography
            variant="subtitle1"
            className={classes.subtitle}
          >
            {translate('administration.general.settings.subtitle')}
          </Typography>
        </Box>
        <Box className={classes.actions}>
          {updatedAt && (
            <HeaderLastSaved
              timestamp={updatedAt}
              loading={isLoading}
            />
          )}
          <Box className={classes.buttons}>
            <Button kind="outlined" disabled>{translate('common.history')}</Button>
            <Button onClick={onSave}>{translate('common.save.changes')}</Button>
          </Box>
        </Box>
        {isLoading && <LinearProgress className={classes.progress} />}
      </Box>
      <Box className={classes.sidebar}>
        <MenuList>
          {panels.map(panel => (
            <MenuItem
              key={panel.key}
              className={classes.listItem}
              onClick={jumpToPanel(panel.key)}
              selected={expandedPanels.includes(panel.key)}
            >
              {translate(panel.title)}
            </MenuItem>
          ))}
        </MenuList>
      </Box>
      <Box className={classes.toggler}>
        <Button kind="ghost" onClick={toggleAllPanels}>
          {translate(allPanelsExpaned ? 'common.collapse.all' : 'common.expand.all')}
        </Button>
      </Box>
      <Box className={classes.panels}>
        {panels.map(panel => (
          <panel.component
            key={panel.key}
            onToggle={togglePanel(panel.key)}
            expanded={expandedPanels.includes(panel.key)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default withThemeNext(GeneralSettingsPresenter);
