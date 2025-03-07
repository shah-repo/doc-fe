import { Box } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React, { useMemo } from 'react';
import { FB, FBTextField } from '..';
import { FBCheckboxGroupAsyncProps } from './FBCheckboxGroupAsync.types';

const OTHER_OPTION_VALUE = 'Other';

const OtherOptionTextField: React.FC<FBCheckboxGroupAsyncProps> = ({ name = '', ...props }) => {
  const { workspaceState } = FB.useStores();
  const fieldName = `input-context-${name}`;
  const selectedOptions = useObserver(() => workspaceState?.formInputSync?.get(name) ?? []);

  const hasOtherOptionSelected = useMemo(
    () => selectedOptions.some((item) => item.text === OTHER_OPTION_VALUE),
    [selectedOptions],
  );

  if (!hasOtherOptionSelected) return null;

  return (
    <Box mt={2}>
      <FBTextField
        {...props}
        dataCy={fieldName}
        label="form.builder.other"
        name={fieldName}
        placeholder="common.enter"
      />
    </Box>
  );
};

export default OtherOptionTextField;
