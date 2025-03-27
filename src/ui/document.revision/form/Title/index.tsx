import React, { FC, memo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { asyncDebounce } from '../../../../common/utils/helpers';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import CreatableField from '../../../components/forms/fields/Autocomplete/Creatable';
import { checkIsDocumentSupplier } from '../../../documentRevision/helpers/checkDocumentGroup';
import { FB } from '../../../form.builder';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import { useTitle } from '../../../hooks/docCustomization/useCustomization';
import TitleState from './state';

interface TitleProps {
  name: string
  documentTypeId?: string
  disabled?: boolean
  value?: string
  documentRevision?: DocumentRevision
}

const Index: FC<TitleProps> = ({
  documentTypeId = '',
  name = 'name',
  documentRevision,
  ...props
}) => {
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useTitle(documentTypeId);
  const titleState = FB.useRef(TitleState);
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isSupplier = checkIsDocumentSupplier(groupOptions);
  const placeholder = isSupplier ? 'form.builder.supplier.enter.title' : 'form.builder.enter.title';

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
    [titleState],
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
        placeholder={intl.formatMessage({ id: placeholder })}
        labelProps={{ margin: 0 }}
        {...{ label }}
      />
    </CustomLabelTooltip>
  );
};

export default memo(Index);
