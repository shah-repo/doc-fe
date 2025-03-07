import React, { useMemo } from 'react';
import { FB, FBTextField } from '..';
import { SUPPLIER_TYPE_OTHER_FIELD_NAME } from './constant';

const OTHER_OPTION_VALUE = 'Other';

interface OtherOptionFieldProps {
  name?: string
}

const OtherOptionField: React.FC<OtherOptionFieldProps> = ({ name = '' }) => {
  const { formState, workspaceState } = FB.useStores();

  const hasOtherOptionSelected = useMemo(() => {
    const selectedOptions = workspaceState?.formInputSync?.get(name) ?? [];
    const hasOther = selectedOptions?.some((item) => item.text === OTHER_OPTION_VALUE);
    return hasOther;
  }, [workspaceState?.checkboxGroupsOptionsMap, workspaceState?.formInputSync, name]);

  console.log('hasOtherOptionSelected', hasOtherOptionSelected);
  console.log('formState?.getFieldValue(name) :::', formState?.getFieldValue(name));

  return (
    <>
      {hasOtherOptionSelected && (
        <FBTextField
          dataCy={SUPPLIER_TYPE_OTHER_FIELD_NAME}
          label="form.builder.other"
          name={SUPPLIER_TYPE_OTHER_FIELD_NAME}
          placeholder="form.builder.other"
        />
      )}
    </>
  );
};

export default OtherOptionField;
