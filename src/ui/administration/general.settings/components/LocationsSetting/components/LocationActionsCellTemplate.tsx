import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import React, { useCallback } from 'react';
import { translate } from '../../../../../../common/intl';
import { CellTemplateProps, DataGridRowClickEvent } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { IconButton } from '../../../../../components/forms/fields-next';
import useHover from '../../../../../hooks/useHover';
import { EditableCompanyLocation } from '../../../panels/CompanyLocations/types';
import useStyles from '../styles';

type Props = CellTemplateProps<EditableCompanyLocation> & GridCellProps & {
  onConfirm: () => void
  onDiscard: () => void
  onDelete: () => void
  onClick: (e: DataGridRowClickEvent<EditableCompanyLocation>) => void
  scrollBehavior?: ScrollBehavior
};

const LocationActionsCellTemplate: React.FC<Props> = ({ onClick, onConfirm, onDiscard, onDelete, scrollBehavior = 'smooth', ...props }) => {
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
    <div ref={ref} >
      <Box className={`${cellStyle} k-command-cell`}>
        <Tooltip title={translate(isEditMode ? 'common.discard' : '')}>
          <IconButton
            kind="simple"
            color="primary"
            style={{ marginRight: '10px' }}
            ref={discardRef}
            onClick={onDiscard }
          >
            {onDiscardIcon && <FontAwesomeIcon icon={onDiscardIcon} />}
          </IconButton>
        </Tooltip>
        <Tooltip title={translate(isEditMode ? 'common.save' : 'common.edit')}>
          <IconButton
            kind="simple"
            color="primary"
            ref={saveRef}
            onClick={isEditMode ? onConfirm : onEdit}
          >
            <FontAwesomeIcon icon={onEditIcon} />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default LocationActionsCellTemplate;
