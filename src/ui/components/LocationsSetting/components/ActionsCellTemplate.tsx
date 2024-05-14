import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import React, { useCallback } from 'react';
import { translate } from '../../../../common/intl';
import { EditableCompanyLocation } from '../../../administration/general.settings/panels/CompanyLocations/types';
import useHover from '../../../hooks/useHover';
import { CellTemplateProps, DataGridRowClickEvent } from '../../KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../KendoDataGrid/constants';
import { IconButton } from '../../forms/fields-next';
import useStyles from '../styles';

type Props = CellTemplateProps<EditableCompanyLocation> & GridCellProps & {
  onConfirm: () => void
  onDiscard: () => void
  onDelete: () => void
  onClick: (e: DataGridRowClickEvent<EditableCompanyLocation>) => void
  scrollBehavior?: ScrollBehavior
};

const ActionsCellTemplate: React.FC<Props> = ({ onClick, onConfirm, onDiscard, onDelete, scrollBehavior = 'smooth', ...props }) => {
  const { dataItem } = props;
  const { cellStyle, deleteButton } = useStyles({ isActive: dataItem?.isActive });
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [saveRef, isSaveHovered] = useHover<HTMLButtonElement>();
  const [discardRef, isDHovered] = useHover<HTMLButtonElement>();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' }));
    }
  }, [scrollBehavior]);

  const onEdit = () => {
    console.log('onEdit');
    onClick?.({ dataItem });
  };

  // const handleOnConfirm = () => {
  //   console.log('handleOnConfirm');
  //   onConfirm();
  // };

  // const handleOnDiscard = () => {
  //   console.log('handleOnDiscard');
  //   onDiscard();
  // };

  // const handleDelete = () => {
  //   console.log('handleOnDelete');
  //   onDelete();
  // };

  return (
    <div ref={ref}>
      <Box className={`${cellStyle} k-command-cell`}>
        <Tooltip title={translate(isEditMode ? 'common.save' : 'common.edit')}>
          <IconButton
            kind="simple"
            color="primary"
            ref={saveRef}
            style={{ marginRight: '10px' }}
            onClick={isEditMode ? onConfirm : onEdit}
          >
            <FontAwesomeIcon icon={isEditMode ? isSaveHovered ? solid('square-check') : regular('square-check') : regular('pen-to-square')} />
          </IconButton>
        </Tooltip>
        <Tooltip title={translate(isEditMode ? 'common.discard' : 'common.delete')}>
          <IconButton
            kind="simple"
            color="primary"
            ref={discardRef}
            onClick={isEditMode ? onDiscard : onDelete}
            className={!isEditMode ? deleteButton : ''}
          >
            <FontAwesomeIcon icon={isEditMode ? isDHovered ? solid('square-xmark') : regular('square-xmark') : regular('trash-can')} />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default ActionsCellTemplate;
