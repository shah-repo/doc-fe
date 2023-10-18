import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelProps, ExpansionPanelSummary, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import { IconButton } from '../../../components/forms/fields-next';
import { Colors } from '../../../layout/theme-next';

interface Props extends ExpansionPanelProps {
  title: string
  onToggle: () => void
}

const MAX_PANEL_WIDTH = 660;

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1),
    border: `1px solid ${Colors.stroke}`,
    borderRadius: theme.spacing(0.5),
    maxWidth: MAX_PANEL_WIDTH,
    boxShadow: 'none',
  },
  summary: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: theme.spacing(2, 1.5),

    '&.Mui-expanded': {
      minHeight: 0,
      color: Colors.primary,
    },
  },
  icon: {
    marginRight: theme.spacing(1.25),

    '&.Mui-expanded': {
      color: Colors.primary,
      transform: 'rotate(90deg)',
    },
  },
  iconButton: {
    width: 24,
    minHeight: 24,
    height: 24,
  },
  content: {
    margin: 0,

    '&.Mui-expanded': {
      margin: 0,
    },
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
  },
  details: {
    display: 'block',
    padding: theme.spacing(0, 2, 2, 6.25),
  },
}));

const SettingsPanel: React.FC<Props> = ({ title, children, onToggle, ...props }) => {
  const classes = useStyles();

  return (
    <ExpansionPanel
      {...props}
      className={classes.root}
    >
      <ExpansionPanelSummary
        onClick={onToggle}
        classes={{
          root: classes.summary,
          content: classes.content,
          expandIcon: classes.icon,
        }}
        expandIcon={(
          <IconButton
            kind="secondary"
            size="small"
            iconSize={12}
            className={classes.iconButton}
          >
            <FontAwesomeIcon icon={regular('chevron-right')} />
          </IconButton>
        )}
      >
        <Typography variant="h2" className={classes.title}>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default SettingsPanel;
