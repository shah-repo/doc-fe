import { get, kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../../components/OverflowTooltip';

function WhenCellTemplate<T extends EditableItem> ({
  dataItem,
  field,
}: CellTemplateProps<T>): React.ReactElement {
  const defaultValue = get(dataItem, field, '') as string;
  const translationReadyValue = kebabCase(defaultValue).replaceAll('-', '.');
  const value = translate(`administration.general.settings.system.transactions.${translationReadyValue}`);

  return (
    <OverflowTooltip
      title={value}
      placement="top"
      arrow
    >
      {value}
    </OverflowTooltip>
  );
}

export default WhenCellTemplate;
