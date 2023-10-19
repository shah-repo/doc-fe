import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import React from 'react';
import { IconButton } from '../../../../components/forms/fields-next';
import { SettingsPanelProps } from '../../types';
import useStyles from './styles';

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  children,
  onToggle,
  ...props
}) => {
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
