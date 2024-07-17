import { kebabCase } from 'lodash';
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
      data-cy={`${kebabCase(field)}-field`}
      placeholder={translate('lhr.summary.placeholder.enter')}
      onChange={handleChange}
      size="small"
    />
  );
};

export const LabelCell: React.FC<CellTemplateProps<LCP>> = (props) => {
  const { field, dataItem, onClick, colSpan, style, className } = props;
  const isEditMode = dataItem[EDIT_FIELD] || dataItem.isAddPhase;
  const handleClick = () => onClick?.({ dataItem });
  const datCy = `${kebabCase(field)}-td`;

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={className}
    data-cy={datCy}
  >
    {isEditMode && <Editor {...props} />}
    {!isEditMode && <OverflowingContent onClick={handleClick} data-cy={datCy}>
      {dataItem[field]}
    </OverflowingContent>}
  </td>;
};
