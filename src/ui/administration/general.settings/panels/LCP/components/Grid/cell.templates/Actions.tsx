import { light, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import React, { useCallback } from 'react';
import { translate } from '../../../../../../../../common/intl';
import { IconButton } from '../../../../../../../components/forms/fields-next';
import useHover from '../../../../../../../hooks/useHover';
import { ActionsProps } from './LCPActionsCellTemplate';
import useStyles from './styles';

const Actions: React.FC<ActionsProps> = ({
  onConfirm,
  onDiscard,
  scrollBehavior = 'auto',
  dataItem,
  ...props
}) => {
  const { cellStyle } = useStyles();
  const isEditMode = dataItem.isAddPhase;
  const [saveRef, isSaveHovered] = useHover<HTMLButtonElement>();
  const [discardRef, isDiscardHovered] = useHover<HTMLButtonElement>();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'center' }));
    }
  }, [scrollBehavior]);

  return (
    <div
      id="row-actions"
      ref={ref}
    >
      <Box className={`${cellStyle} k-command-cell`}>
        {isEditMode && (
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
        )}
      </Box>
    </div>
  );
};

export default Actions;
