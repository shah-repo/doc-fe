import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import cx from 'classnames';
import React, { MouseEventHandler, RefObject } from 'react';
import { translate } from '../../../../../common/intl';
import { Button, IconButton } from '../../../../components/forms/fields-next';
import useSticky from '../../../../hooks/useSticky';
import { SettingsPanelProps } from '../../types';
import useStyles from './styles';

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  info,
  children,
  containerRef,
  onToggle,
  onAddNew,
  ...props
}) => {
  const classes = useStyles();
  const [stickyRef, isSticky] = useSticky(containerRef);

  const handleAddNew: MouseEventHandler = (e) => {
    e.stopPropagation();
    onAddNew?.();
  };

  return (
    <ExpansionPanel
      {...props}
      className={classes.root}
      TransitionProps={{
        mountOnEnter: true,
        unmountOnExit: true,
        ...props.TransitionProps,
      }}
    >
      <ExpansionPanelSummary
        ref={stickyRef as RefObject<HTMLDivElement>}
        onClick={() => onToggle()}
        classes={{
          root: cx(classes.summary, { [classes.stickySummary]: isSticky }),
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
        {info && <Typography className={classes.info}>{info}</Typography>}
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
      <ExpansionPanelDetails className={cx(classes.details, { [classes.detailsWithStickyTitle]: isSticky })}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default SettingsPanel;
