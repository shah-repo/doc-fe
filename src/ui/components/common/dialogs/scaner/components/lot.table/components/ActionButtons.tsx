import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React, { MutableRefObject } from 'react';
import { translate } from '../../../../../../../../common/intl';
import useHover from '../../../../../../../hooks/useHover';
import { Colors } from '../../../../../../../layout/theme-next';
import { IconButton } from '../../../../../../forms/fields-next';
import useStyles from '../styles';

interface Props {
  isLoading?: boolean
  onDelete?: () => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ActionsButtons: React.FC<Props> = (
  { isLoading, onDelete, onOpenQuickView },
  ref: MutableRefObject<HTMLDivElement>,
) => {
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();
  const [viewIconRef, isViewIconHovered] = useHover<HTMLButtonElement>();
  const classes = useStyles();

  return (
    <div id="row-actions" ref={ref} className={cx(classes.actions)}>
      <>
        <Tooltip arrow title={translate('common.quick.view')} placement="top">
          <IconButton
            ref={viewIconRef}
            kind="form"
            color="primary"
            onClick={onOpenQuickView}
            size="small"
            data-cy="quick-view"
          >
            <FontAwesomeIcon
              icon={isViewIconHovered ? solid('eye') : regular('eye')}
              color={isViewIconHovered ? Colors.navigationBg : Colors.textGray}
            />
          </IconButton>
        </Tooltip>
        {onDelete && (
          <Tooltip arrow title={translate('common.delete')} placement="top">
            <IconButton
              kind="destructive"
              ref={deleteRef}
              onClick={onDelete}
              disabled={isLoading}
              size="small"
              data-cy="action-delete"
            >
              <FontAwesomeIcon icon={isDeleteHovered ? solid('trash-can') : regular('trash-can')} />
            </IconButton>
          </Tooltip>
        )}
      </>
    </div>
  );
};

export default React.forwardRef(ActionsButtons);
