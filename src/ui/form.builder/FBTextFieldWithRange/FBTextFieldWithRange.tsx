import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip, Grid, Tooltip, Zoom } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { ChipComponentProps, FBInput, FBOutOfRange, FBText, FBTextFieldWithRangeProps } from '..';
import { translate } from '../../../common/intl';
import { Autocomplete, FormField, TextField } from '../../components/forms/fields-next';
import { withThemeNext } from '../../layout/theme-next';
import { FBFontStyle } from '../styles/FBFont.styles';
import useStyles from './FBTextFieldWithRange.styles';
import { useOptions } from './FBTextFieldWithRange.utils';
import { withFBTextFieldWithRange } from './FBTextFieldWithRange.wrap';

const naText = translate('common.not.applicable');

const ChipComponent: React.FC<ChipComponentProps> = withThemeNext(({
  label,
  tooltip,
  className,
  isActive = false,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <>
        <Chip
          label={<>
            <span className={cx(classes.chipIcon, { [classes.chipIconActive]: isActive })}>
              <Zoom in={isActive}>
                <FontAwesomeIcon icon={solid('circle-check')} />
              </Zoom>
            </span>
            {label}
          </>}
          className={cx(classes.chip, className, { [classes.chipActive]: isActive })}
          onClick={() => onChange?.(!isActive)}
        />
      </>
    </Tooltip>
  );
});

const FBTextFieldWithRange: React.FC<FBTextFieldWithRangeProps> = ({
  name,
  placeholder,
  index = 0,
  label = '',
  type = 'textfieldwithrange',
  rules,
  value,
  error,
  helperText,
  autosave = false,
  disabled = false,
  loading = false,
  isInspected = false,
  isCriticalToQuality,
  hasRange = false,
  hasTolerance = false,
  hasUnits = false,
  isPartFaiRequired = false,
  isPartIqcRequired = false,
  range,
  tolerance,
  onUpdate,
  ...props
}) => {
  const classes = useStyles();
  const { units, isLoading } = useOptions();

  const attributeConfig: string[] = [];

  if (hasRange && range) {
    attributeConfig.push(translate('form.builder.allowed.range', {
      from: range.from ?? naText,
      to: range.to ?? naText,
    }));
  }

  if (hasTolerance && tolerance) {
    attributeConfig.push(translate('form.builder.allowed.tolerance', {
      tolerance: tolerance,
    }));
  }

  const isToleranceDefined = hasTolerance && tolerance !== undefined;
  const isRangeDefined = hasRange && (range?.from !== undefined && range?.to !== undefined);
  const isNumericInput = isRangeDefined || isToleranceDefined;

  return (
    <FBInput
      {...props}
      name={name}
      type={type}
      index={index}
      value={value}
      autosave={autosave}
      disabled={disabled}
    >
      <div data-cy={`${type}-${index}`}>
        <Grid container spacing={1}>
          <Grid item md={hasUnits ? 8 : 12} xs={6}>
            <FormField
              loading={isLoading}
              error={error}
              helperText={helperText}
              disabled={disabled}
              label={
                <div className={cx(classes.label, { [classes.labelWithAlert]: isCriticalToQuality })}>
                  <FBText
                    loading={loading || isLoading}
                    labelProps={{
                      ...props.labelProps,
                      ...FBFontStyle.labelProps,
                    }}
                    locale={String(label)}
                  />
                  {isInspected && (
                    <div className={classes.options}>
                      {isPartFaiRequired && (
                        <ChipComponent
                          label={translate('form.builder.fai')}
                          tooltip={translate('form.builder.fai.not.required')}
                          isActive={value?.isFaiRequired}
                          className={cx(classes.chip, { [classes.chipActive]: value?.isFaiRequired })}
                          onChange={(isActive) => onUpdate?.({ isFaiRequired: isActive })}
                        />
                      )}
                      {isPartIqcRequired && (
                        <ChipComponent
                          label={translate('form.builder.iqc')}
                          tooltip={translate('form.builder.iqc.not.required')}
                          isActive={value?.isIqcRequired}
                          className={cx(classes.chip, { [classes.chipActive]: value?.isIqcRequired })}
                          onChange={(isActive) => onUpdate?.({ isIqcRequired: isActive })}
                        />
                      )}
                    </div>
                  )}
                  {isCriticalToQuality && (
                    <span className={classes.qualityAlert}>
                      <FontAwesomeIcon icon={solid('triangle-exclamation')} />
                      {translate('form.builder.critical.to.quality')}
                    </span>
                  )}
                </div>
              }
            >
              <TextField
                defaultValue={value?.value}
                placeholder={placeholder}
                endAdornment={hasRange && (
                  <span className={classes.outOfRange}>
                    <FBOutOfRange pass={range} parentName={name} path="value" />
                  </span>
                )}
                inputProps={isNumericInput ? {
                  type: 'number',
                  min: range?.from,
                  max: range?.to,
                  step: tolerance,
                } : {}}
                onBlur={e => onUpdate?.({ value: parseFloat(e.target.value) })}
              />
            </FormField>
          </Grid>
          {hasUnits && (
            <Grid item md={4} xs={6}>
              <FormField label="form.builder.unit" loading={isLoading} disabled={disabled}>
                <Autocomplete
                  options={units}
                  value={value?.unit}
                  onChange={(_, value: string) => onUpdate?.({ unit: value })}
                />
              </FormField>
            </Grid>
          )}
        </Grid>
        <div className={classes.attributes}>
          <span>
            {attributeConfig.join(', ')}
          </span>
        </div>
      </div>
    </FBInput>
  );
};

export default withFBTextFieldWithRange(FBTextFieldWithRange);
