import React from 'react';
import { Employee } from '../../../../../state/ducks/company/types';
import { AvatarComponent } from '../../../../components/common/kendo.column.templates/UserAvatar';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { AutocompleteCellTemplate } from './AutocompleteCellTemplate';

interface Props extends CustomTemplateProps {
  options: Employee[]
}

const getOptionLabel = (option: Employee) => option.user?.name ?? '';

export const UserCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field } = props;

  const renderStoredValue = () => {
    const owner = dataItem[field] as Employee;

    if (!owner?.user) {
      return EMPTY_VALUE_PLACEHOLDER;
    }

    return (
      <AvatarComponent {...owner.user} />
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
