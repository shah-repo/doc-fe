import { useObserver } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import { FB, FBData, FBInput, FBInputProps, FBRadioGroup } from '..';
import { translate } from '../../../common/intl';
import { Autocomplete } from '../../components/forms/fields-next';
import { FBFontStyle } from '../styles/FBFont.styles';
import useStyles from './styles';
import { SamplingPlanType, SamplingPlanValue } from './types';

const FBSamplingPlan: React.FC<FBInputProps> = ({
  name = '',
  label = '',
  disabled = false,
  ...props
}) => {
  const classes = useStyles();
  const { formState } = FB.useStores();

  const value = useObserver<SamplingPlanValue | undefined>(
    () => formState?.newValues.get(name) ?? formState?.getFieldValue(name),
  );

  const { aqlOptions, defaultAqlLevel } = useMemo(() => {
    return {
      aqlOptions: FBData.aqlOptions,
      defaultAqlLevel: FBData.aqlOptions[FBData.aqlOptions.length - 1].value,
    };
  }, []);

  useEffect(() => {
    if (!value) {
      setValue({ type: SamplingPlanType.ALL });
    }
  }, [value]);

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
          aqlLevel: aqlLevel ?? defaultAqlLevel,
        });
        break;
      default:
        break;
    }
    formState?.validate();
    formState?.setFieldAutosave(name);
  };

  const aqlLevelValue = useMemo(() => {
    return value?.aqlLevel
      ? aqlOptions.find(option => option.value === value.aqlLevel)
      : defaultAqlLevel;
  }, [value?.aqlLevel]);

  return (
    <FBInput {...props} name={name} label={label} labelProps={FBFontStyle.labelProps} shouldOmitValue disabled={disabled}>
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
          value={value?.type ?? SamplingPlanType.ALL}
          onChange={(e) => setValue({ type: e.target.value as SamplingPlanType })}
          gutter={false}
        />
        {value?.type === SamplingPlanType.AQL && (
          <div className={classes.aqlLevel}>
            <Autocomplete
              options={aqlOptions}
              getOptionLabel={option => option.text}
              onChange={(e, { value: aqlLevel }) => setValue({ type: SamplingPlanType.AQL, aqlLevel })}
              value={aqlLevelValue}
              disableClearable
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
