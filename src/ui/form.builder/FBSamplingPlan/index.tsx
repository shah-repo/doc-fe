import { useObserver } from 'mobx-react';
import React, { useMemo } from 'react';
import { FB, FBData, FBInput, FBInputProps, FBRadioGroup } from '..';
import { translate } from '../../../common/intl';
import { Autocomplete } from '../../components/forms/fields-next';
import { FBFontStyle } from '../styles/FBFont.styles';
import useStyles from './styles';
import { SamplingPlanAqlLevelOption, SamplingPlanType, SamplingPlanValue } from './types';

const YES_VALUE = translate('form.builder.yes');
const IQC_REQUIRED_KEY = 'iqc-required';

const FBSamplingPlan: React.FC<FBInputProps> = ({
  name = '',
  label = '',
  disabled = false,
  ...props
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const isFormMode = useObserver(() => formState?.workspaceMode === 'design' || formState?.workspaceMode === 'formPreview');
  const hasIcqField = useObserver(() => workspaceState?.schema?.some(
    (item) => item.name === IQC_REQUIRED_KEY && !item.deleted,
  ));

  const [value, isIqcRequired] = useObserver<[SamplingPlanValue | undefined, boolean]>(
    () => [
      (formState?.newValues.get(name) ?? formState?.getFieldValue(name)) as SamplingPlanValue | undefined,
      (formState?.newValues.get(IQC_REQUIRED_KEY) ?? formState?.getFieldValue(IQC_REQUIRED_KEY)) === YES_VALUE,
    ],
  );

  const setValue = ({ type, aqlLevel }: SamplingPlanValue) => {
    switch (type) {
      case SamplingPlanType.ALL:
        formState?.setFieldValue(name, {
          type,
        });
        break;
      case SamplingPlanType.AQL:
        formState?.setFieldValue(name, {
          type,
          aqlLevel,
        });
        break;
      default:
        formState?.omitFieldValue(name);
        break;
    }
    formState?.validate();
    formState?.setFieldAutosave(name);
  };

  const aqlLevelValue = useMemo(
    () => FBData.aqlOptions.find(option => option.value === value?.aqlLevel),
    [value?.aqlLevel],
  );

  const updateAqlLevel = (e: unknown, aqlLevel: SamplingPlanAqlLevelOption | null) => {
    setValue({ type: SamplingPlanType.AQL, aqlLevel: aqlLevel?.value });
  };

  if (!isIqcRequired && !isFormMode && hasIcqField) {
    return null;
  }

  return (
    <FBInput
      {...props}
      name={name}
      label={label}
      labelProps={FBFontStyle.labelProps}
      disabled={disabled}
      shouldOmitValue
    >
      <div className={classes.root}>
        <FBRadioGroup
          options={[
            {
              text: '100%',
              value: SamplingPlanType.ALL,
            },
            {
              text: translate('form.builder.aql'),
              value: SamplingPlanType.AQL,
            },
          ]}
          disabled={disabled}
          value={value?.type}
          onChange={(e) => setValue({ type: e.target.value as SamplingPlanType })}
          gutter={false}
        />
        {(value?.type === SamplingPlanType.AQL || isFormMode) && (
          <div className={classes.aqlLevel}>
            <Autocomplete
              options={FBData.aqlOptions}
              getOptionLabel={(option: SamplingPlanAqlLevelOption) => option.text}
              onChange={updateAqlLevel}
              value={aqlLevelValue}
              size="small"
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </FBInput>
  );
};

export default FBSamplingPlan;
