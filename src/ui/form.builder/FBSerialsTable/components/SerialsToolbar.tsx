import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { translate } from '../../../../common/intl';
import { IconButton } from '../../../components/forms/fields-next';
import useHover from '../../../hooks/useHover';
import useStyles from '../styles';
import StatusButton, { StatusButtonType } from './StatusButton';

interface SerialsToolbarProps {
  toolbarRef?: React.RefObject<HTMLDivElement>
  selectedCount: number
  shouldShowBulkActions?: boolean
  onClearSelection: () => void
  onAcceptSelected?: () => void
  onRejectSelected?: () => void
  onDeleteSelected?: () => void
}

const SerialsToolbar: React.FC<SerialsToolbarProps> = ({
  toolbarRef,
  selectedCount,
  shouldShowBulkActions,
  onClearSelection,
  onAcceptSelected,
  onRejectSelected,
  onDeleteSelected,
}) => {
  const classes = useStyles();
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();

  const toolbar = (
    <div className={classes.toolbar}>
      {shouldShowBulkActions && (
        <>
          <div className={classes.selectionContainer}>
            <Tooltip title={translate('form.builder.serials.clear.selection')}>
              <IconButton onClick={onClearSelection} size="small" kind="action">
                <FontAwesomeIcon icon={solid('xmark')} />
              </IconButton>
            </Tooltip>
            <span>
              <span className={classes.selectedCount}>{selectedCount}</span>
              &nbsp;
              {translate('form.builder.serials.items.selected')}
            </span>
          </div>
          {onAcceptSelected && onRejectSelected && (
            <>
              <StatusButton
                type={StatusButtonType.ACCEPT}
                onClick={onAcceptSelected}
              />
              <StatusButton
                type={StatusButtonType.REJECT}
                onClick={onRejectSelected}
              />
            </>
          )}
          {onDeleteSelected && (
            <Tooltip title={translate('form.builder.serials.delete.selected')}>
              <IconButton
                kind="destructive"
                ref={deleteRef}
                onClick={onDeleteSelected}
                data-cy="action-delete"
              >
                <FontAwesomeIcon icon={isDeleteHovered ? solid('trash-can') : regular('trash-can')} size="lg" />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );

  return toolbarRef?.current ? ReactDOM.createPortal(toolbar, toolbarRef.current) : toolbar;
};

export default SerialsToolbar;
