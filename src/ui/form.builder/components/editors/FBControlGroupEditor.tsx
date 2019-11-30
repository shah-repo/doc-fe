import React from 'react';
import FBOptionsContainer from '../custom/FBOptionsContainer';
import FBCheckbox from '../inputs/FBCheckbox';
import FBLabelEditor from './FBLabelEditor';
import FBStepperEditor from './FBStepperEditor';

const FBControlGroupEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBOptionsContainer label="form.builder.options" name="options" />
    <FBCheckbox
      type="checkbox"
      label="form.builder.include.other"
      name="includeOther"
    />
  </FBStepperEditor>
);

export default FBControlGroupEditor;
