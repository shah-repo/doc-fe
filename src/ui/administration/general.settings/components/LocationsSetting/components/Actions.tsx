import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import React, { useCallback } from 'react';
import { translate } from '../../../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { IconButton } from '../../../../../components/forms/fields-next';
import useHover from '../../../../../hooks/useHover';
import useStyles from '../styles';
import { ActionsProps } from './LocationActionsCellTemplate';

const Actions: React.FC<ActionsProps> = ({
  onClick,
  onConfirm,
  onDiscard,
  scrollBehavior = 'auto',
  ...props
}) => {
  const { dataItem } = props;
  const { cellStyle } = useStyles({ isActive: dataItem?.isActive });
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [saveRef, isSaveHovered] = useHover<HTMLButtonElement>();
  const [discardRef, isDHovered] = useHover<HTMLButtonElement>();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'center' }));
    }
  }, [scrollBehavior]);

  const onDiscardIcon = isEditMode && (isDHovered ? solid('square-xmark') : regular('square-xmark'));
  const onEditIcon = isEditMode ? isSaveHovered ? solid('square-check') : regular('square-check') : regular('pen-to-square');

  const onEdit = () => onClick?.({ dataItem });

  return (
    <div
      id="row-actions"
      ref={ref}
    >
      <Box className={`${cellStyle} k-command-cell`}>
        <Tooltip title={translate(isEditMode ? 'common.discard' : '')}>
          <IconButton
            kind="simple"
            color="primary"
            style={{ marginRight: '10px' }}
            ref={discardRef}
            onClick={onDiscard}
          >
            {onDiscardIcon && <FontAwesomeIcon icon={onDiscardIcon} size="lg" />}
          </IconButton>
        </Tooltip>
        <Tooltip title={translate(isEditMode ? 'common.save' : 'common.edit')}>
          <IconButton
            kind="simple"
            color="primary"
            ref={saveRef}
            onClick={isEditMode ? onConfirm : onEdit}
          >
            {onEditIcon && <FontAwesomeIcon icon={onEditIcon} size="lg" />}
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default Actions;
