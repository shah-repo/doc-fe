import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React, { useCallback } from 'react';
import { translate } from '../../../../common/intl';
import { IconButton } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import useStyles from '../styles';

export interface ActionsProps<T> {
  dataItem: T
  onConfirm: () => void
  onDiscard: () => void
  scrollBehavior?: ScrollBehavior
}

export default function Actions <T> (props: ActionsProps<T>): React.ReactElement | null {
  const {
    dataItem,
    scrollBehavior = 'auto',
    onConfirm, onDiscard,
  } = props;
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' }));
    }
  }, [scrollBehavior]);

  if (!isEditMode) {
    return null;
  }

  return (
    <div
      className={classes.actions}
      id="row-actions"
      ref={ref}
    >
      <Tooltip
        title={translate('common.discard')}
        placement="top"
        arrow
      >
        <IconButton
          data-cy="action-discard"
          kind="action"
          size="small"
          onClick={onDiscard}
        >
          <FontAwesomeIcon icon={regular('xmark')} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={translate('common.save')}
        placement="top"
        arrow
      >
        <IconButton
          data-cy="action-save"
          kind="action"
          size="small"
          onClick={onConfirm}
        >
          <FontAwesomeIcon icon={regular('check')} />
        </IconButton>
      </Tooltip>
    </div>
  );
}
