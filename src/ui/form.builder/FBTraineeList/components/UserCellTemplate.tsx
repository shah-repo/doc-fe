import React from 'react';
import { Employee } from '../../../../state/ducks/company/types';
import { AvatarComponent } from '../../../components/common/kendo.column.templates/UserAvatar';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { AutocompleteCellTemplate } from './AutocompleteCellTemplate';

interface Props extends CustomTemplateProps {
  options: Employee[]
}

const getOptionLabel = (option: Employee) => option.user?.name ?? '';

export const UserCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field, options } = props;

  const actoveEmployeeOptions = options.filter(item => item.active);
  const userId = dataItem[field] as string;
  const user = options.find((item) => item.id === userId) as Employee;

  const renderStoredValue = () => {
    if (!user?.user) {
      return EMPTY_VALUE_PLACEHOLDER;
    }

    return (
      <AvatarComponent {...user.user} />
    );
  };

  return (
    <AutocompleteCellTemplate
      {...props}
      getOptionLabel={getOptionLabel}
      renderStoredValue={renderStoredValue}
      options={actoveEmployeeOptions}
    />
  );
};
