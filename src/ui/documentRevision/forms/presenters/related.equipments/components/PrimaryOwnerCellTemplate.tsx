import React from 'react';
import { CustomTemplateProps } from '../types';
import { Employee } from '../../../../../../state/ducks/company/types';
import { AutocompleteCellTemplate } from './AutocompleteCellTemplate';
import OverflowContent from '../../../../../components/OverflowContent';
import { AvatarComponent } from '../../../../../components/common/kendo.column.templates/UserAvatar';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';

interface Props extends CustomTemplateProps {
  options: Employee[]
}

const getOptionLabel = (option: Employee) => option.user?.name ?? '';

export const PrimaryOwnerCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field } = props;

  const renderStoredValue = () => {
    const owner = dataItem[field] as Employee;

    if (!owner?.user) {
      return EMPTY_VALUE_PLACEHOLDER;
    }

    const displayValue = getOptionLabel(owner);

    return (
      <OverflowContent title={displayValue}>
        <AvatarComponent {...owner.user} />
      </OverflowContent>
    );
  };

  return (
    <AutocompleteCellTemplate
      getOptionLabel={getOptionLabel}
      renderStoredValue={renderStoredValue}
      {...props}
    />
  );
};
