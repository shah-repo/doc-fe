import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
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
  isActive,
  ...props
}) => {
  const { dataItem } = props;
  const { cellStyle } = useStyles({ isActive: dataItem?.isActive });
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [saveRef, isSaveHovered] = useHover<HTMLButtonElement>();
  const [discardRef, isDiscardHovered] = useHover<HTMLButtonElement>();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'center' }));
    }
  }, [scrollBehavior]);

  const onEdit = () => onClick?.({ dataItem });

  return (
    <div
      id="row-actions"
      ref={ref}
    >
      <Box className={`${cellStyle} k-command-cell`}>
        {isEditMode ? (
          <>
            <Tooltip title={translate('common.discard')}>
              <IconButton
                kind="simple"
                color="primary"
                ref={discardRef}
                onClick={onDiscard}
                iconSize={22}
              >
                <FontAwesomeIcon icon={isDiscardHovered ? solid('square-xmark') : light('square-xmark')} />
              </IconButton>
            </Tooltip>
            <Tooltip title={translate('common.save')}>
              <IconButton
                kind="simple"
                color="primary"
                ref={saveRef}
                onClick={onConfirm}
                iconSize={22}
              >
                <FontAwesomeIcon icon={isSaveHovered ? solid('square-check') : light('square-check')} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title={translate('common.edit')}>
            <IconButton
              kind="simple"
              color="primary"
              ref={saveRef}
              onClick={onEdit}
              disabled={!isActive}
            >
              <FontAwesomeIcon icon={regular('pen-to-square')} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </div>
  );
};

export default Actions;
