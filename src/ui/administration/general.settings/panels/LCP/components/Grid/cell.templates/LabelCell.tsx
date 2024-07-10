import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import OverflowingContent from '../../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import { TextField } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EDIT_FIELD } from '../constants';
import { LCP } from '../types';

const Editor: React.FC<CellTemplateProps<LCP>> = ({ dataItem, dataIndex, field, onChange }) => {
  const handleChange = (e) => {
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: e.syntheticEvent,
      field,
      value: e.target.value,
    });
  };

  return (
    <TextField
      defaultValue={dataItem[field]}
      type="text"
      placeholder={translate('lhr.summary.placeholder.enter')}
      onChange={handleChange}
      size="small"
    />
  );
};

export const LabelCell: React.FC<CellTemplateProps<LCP>> = (props) => {
  const { field, dataItem, onClick, colSpan, style, className } = props;
  const isEditMode = dataItem[EDIT_FIELD];
  const handleClick = () => onClick?.({ dataItem });

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={className}
    data-cy="cell-alternate-parts"
  >
    {isEditMode && <Editor {...props} />}
    {!isEditMode && <OverflowingContent onClick={handleClick}>
      {dataItem[field]}
    </OverflowingContent>}
  </td>;
};
