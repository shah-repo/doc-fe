import * as React from 'react';
import SelectField from '../../../components/forms/fields/Select';
import { styles as FBAutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import { styles } from './styles/DocIdInput.styles';

interface Props {
  isDocRevStatusDraft: boolean
  isDisabled: boolean
  label?: string
}

const LifecyclePhaseOptions = [
  { value: 'Concept', text: 'Concept' },
  { value: 'Design', text: 'Design' },
  { value: 'Development', text: 'Development' },
  { value: 'Production', text: 'Production' },
  { value: 'Support & Service', text: 'Support & Service' },
  { value: 'Retirement', text: 'Retirement' },
];

const LifecyclePhaseSelect: React.FunctionComponent<Props> = ({
  isDocRevStatusDraft,
  isDisabled = false,
  label = 'common.lifecycle.phase',
  tooltipConfig = {},
}) => {
  const classes = styles();

  const handleTypeChange = (
    event: React.ChangeEvent<{ name?: string, value: unknown }>,
  ) => {
    const value = event.target.value as string;
    console.log({ value });
  };

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <SelectField
        name="document.lifecyclePhaseSelect"
        label={label}
        selectProps={{
          onChange: handleTypeChange,
        }}
        options={LifecyclePhaseOptions}
        includeEmpty={false}
        inputStyleProps={classes.input}
        labelProps={FBAutoCompleteStyles.labelStyle}
      />
    </CustomLabelTooltip>
  );
};

export default LifecyclePhaseSelect;
