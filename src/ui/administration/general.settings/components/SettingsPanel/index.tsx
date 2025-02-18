import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Tooltip, Typography } from '@material-ui/core';
import cx from 'classnames';
import React, { MouseEventHandler, RefObject, useRef } from 'react';
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
  expanded,
  onToggle,
  onAddNew,
  isOutOfSync,
  ...props
}) => {
  const classes = useStyles();
  const [stickyRef, isSticky] = useSticky(containerRef);
  const isAddPending = useRef(false);

  const handleAddNew: MouseEventHandler = (e) => {
    e.stopPropagation();
    if (expanded) {
      onAddNew?.();
      return;
    }
    onToggle();
    isAddPending.current = true;
  };

  const handleOnEntered = () => {
    if (isAddPending.current) {
      isAddPending.current = false;
      onAddNew?.();
    }
  };

  return (
    <ExpansionPanel
      {...props}
      expanded={expanded}
      className={classes.root}
      TransitionProps={{
        mountOnEnter: true,
        unmountOnExit: true,
        onEntered: handleOnEntered,
        ...props.TransitionProps,
      }}
    >
      <ExpansionPanelSummary
        ref={stickyRef as RefObject<HTMLDivElement>}
        onClick={onToggle}
        classes={{
          root: cx(classes.summary, { [classes.stickySummary]: isSticky }),
          content: cx(classes.content, { [classes.settingOutOfSync]: isOutOfSync }),
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
        {isOutOfSync && (
          <Tooltip title={translate('administration.general.settings.approvalRoles.sync.message.dialog.out.of.sync.with.dam')}>
            <div className={classes.outOfSyncBox}>
              <FontAwesomeIcon className={classes.outOfSyncIcon} icon={regular('rotate-exclamation')} />
            </div>
          </Tooltip>
        )}
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
