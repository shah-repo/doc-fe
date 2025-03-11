import { Box } from '@material-ui/core';
import React, { FC, useMemo } from 'react';
import { FBTextField } from '..';
import { FBCheckboxGroupAsyncProps } from './FBCheckboxGroupAsync.types';

const OTHER_OPTION_VALUE = 'Other';

const OtherOptionTextField: FC<FBCheckboxGroupAsyncProps> = ({ name = '', selectedCheckBoxOptions, ...props }) => {
  const fieldName = `input-context-${name}`;
  const hasOtherOptionSelected = useMemo(
    () => Boolean(selectedCheckBoxOptions?.some((item) => item.text === OTHER_OPTION_VALUE)),
    [selectedCheckBoxOptions],
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
