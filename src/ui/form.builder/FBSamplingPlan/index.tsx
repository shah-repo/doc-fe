import { useObserver } from 'mobx-react';
import React, { useMemo } from 'react';
import { FB, FBData, FBInput, FBInputProps, FBRadioGroup } from '..';
import { translate } from '../../../common/intl';
import { Autocomplete } from '../../components/forms/fields-next';
import { FBFontStyle } from '../styles/FBFont.styles';
import useStyles from './styles';
import { SamplingPlanAqlLevelOption, SamplingPlanType, SamplingPlanValue } from './types';

const FBSamplingPlan: React.FC<FBInputProps> = ({
  name = '',
  label = '',
  disabled = false,
  ...props
}) => {
  const classes = useStyles();
  const { formState } = FB.useStores();

  const value = useObserver<SamplingPlanValue | undefined>(
    () => (formState?.newValues.get(name) ?? formState?.getFieldValue(name)) as SamplingPlanValue | undefined,
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

  return (
    <FBInput
      {...props}
      name={name}
      label={label}
      labelProps={FBFontStyle.labelProps}
      disabled={disabled}
      shouldOmitValue
      rules={{
        type: 'required',
        aqlValue: 'required_if:sampling-plan.type,aql|numeric',
      }}
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
        {value?.type === SamplingPlanType.AQL && (
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
