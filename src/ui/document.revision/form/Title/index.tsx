import React, { FC, useCallback, memo } from 'react';
import { useIntl } from 'react-intl';
import CreatableField from '../../../components/forms/fields/Autocomplete/Creatable';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import { useTitle } from '../../../hooks/docCustomization/useCustomization';
import { FB } from '../../../form.builder';
import TitleState from './state';
import { asyncDebounce } from '../../../../common/utils/helpers';

interface TitleProps {
  name: string;
  documentTypeId?: string;
  disabled?: boolean;
  value?: string;
}

const Index: FC<TitleProps> = ({
  documentTypeId = '',
  name = 'name',
  ...props
}) => {
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useTitle(documentTypeId);
  const titleState = FB.useRef(TitleState);

  const loadOptions = useCallback(
    asyncDebounce(
      async (inputValue: string) => {
        const data = await titleState.searchByName(inputValue);

        return data?.results.map(({ name }) => ({
          label: name,
          value: name,
        }));
      },
      300,
    ),
    [titleState]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <CreatableField
        name={name}
        creatableProps={{
          loadOptions,
          id: 'Title-field',
        }}
        isDisabled={props.disabled}
        placeholder={intl.formatMessage({ id: 'form.builder.enter.title' })}
        labelProps={{ margin: 0 }}
        {...{ label }}
      />
    </CustomLabelTooltip>
  );
};

export default memo(Index);
