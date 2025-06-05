import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import { dotCase } from '../../../../../common/utils/helpers';
import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../../components/OverflowTooltip';

function WhenCellTemplate<T extends EditableItem> ({
  dataItem,
  field,
}: CellTemplateProps<T>): React.ReactElement {
  const defaultValue = get(dataItem, field, '') as string;
  const translationReadyValue = dotCase(defaultValue);
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
