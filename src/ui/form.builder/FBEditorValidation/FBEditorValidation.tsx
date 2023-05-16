import { Box } from '@material-ui/core';
import React from 'react';
import { FBEditorValidationProps, FBRadioGroup, FBSchema } from '..';
import Colors from '../../layout/theme/utils/colors';
import { FBFontStyle } from '../styles/FBFont.styles';
import { withFBEditorValidation } from './FBEditorValidation.wrap';

const FBEditorValidation: React.FunctionComponent<FBEditorValidationProps> = ({
  schema = [],
  schemaState,
}) => (
  <>
    <Box bgcolor={Colors.white} px={2} pt={1}>
      <FBRadioGroup
        name="validationMode"
        label="Rule Mode"
        defaultValue="default"
        row={false}
        options={[
          {
            text: 'Default',
            value: 'default',
          },
          {
            text: 'Show/Hide',
            value: 'visibility',
          },
          {
            text: 'Enable/disable',
            value: 'disabled',
          },
        ]}
        labelProps={FBFontStyle.labelProps}
      />
    </Box>
    <Box px={2}>
      <FBSchema {...{ schema, schemaState }} />
    </Box>
  </>
);

export default withFBEditorValidation(FBEditorValidation);
