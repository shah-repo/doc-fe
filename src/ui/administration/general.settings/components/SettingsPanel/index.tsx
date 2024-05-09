import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import { translate } from '../../../../../common/intl';
import { Button, IconButton } from '../../../../components/forms/fields-next';
import { SettingsPanelProps } from '../../types';
import useStyles from './styles';

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  helperText,
  children,
  onToggle,
  onAddNew,
  ...props
}) => {
  const classes = useStyles();

  const handleAddNew: MouseEventHandler = (e) => {
    e.stopPropagation();
    onAddNew?.();
  };

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
        {helperText && <Typography className={classes.helperText}>{helperText}</Typography>}
        {onAddNew && (
          <Button
            kind="ghost"
            size="small"
            startIcon={<FontAwesomeIcon icon={regular('circle-plus')} />}
            onClick={handleAddNew}
            data-cy="add-new"
          >
            {translate('common.add.new')}
          </Button>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default SettingsPanel;
