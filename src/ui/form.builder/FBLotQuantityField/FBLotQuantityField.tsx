import { Grid } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBInputProps, FBTextField, FBWorkspaceModeOptions } from '..';
import FBUnitMeasures from '../FBUnitMeasures/FBUnitMeasures';

interface ConversionData {
  conversion?: number
  unitsBuy?: string
  unitsUse?: string
}

const getUnitsLabel = (name: string) => {
  switch (name) {
    case 'lot_quantity':
      return 'form.builder.field.units.buy';
    case 'lot_usable_quantity':
      return 'form.builder.field.units.use';
    default:
      return 'form.builder.field.units';
  }
};

const getQuantityLabelPrefix = (name: string, conversion?: ConversionData) => {
  switch (name) {
    case 'lot_quantity': {
      const unitsBuy = conversion?.unitsBuy ? `1 ${conversion.unitsBuy}` : '';
      const unitsUse = conversion?.unitsUse && conversion?.conversion ? `${conversion?.conversion} ${conversion.unitsUse}` : '';
      const suffix = unitsBuy && unitsUse ? ` (${unitsBuy} = ${unitsUse})` : '';
      return suffix;
    }
    default:
      return '';
  }
};

const FBQuantityField: React.FC<FBInputProps> = ({
  name = '',
  label = '',
  ...props
}) => {
  const { workspaceState, formState } = FB.useStores();
  const { workspaceMode: mode } = formState ?? {};
  const value = formState?.getFieldValue(name) as number;
  const unit = useObserver(() => workspaceState?.formInputSync.get(`${name}_unit`) as string);
  const conversion = useObserver(() => workspaceState?.formInputSync.get('part-conversion') as ConversionData);
  const unitsLabel = getUnitsLabel(name);
  const quantityLabelPrefix = getQuantityLabelPrefix(name, conversion);
  const fieldLabel = `${label as string}${quantityLabelPrefix}`;

  if (mode === FBWorkspaceModeOptions.PREVIEW) {
    return (
      <FBTextField
        {...props}
        label={label}
        name={undefined}
        gutter={false}
        defaultValue={`${value ?? ''} ${unit ?? ''}`}
        disabled
      />
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item md={8} xs={6}>
        <FBTextField
          {...props}
          label={fieldLabel}
          name={name}
          type="number"
          inputProps={{ min: '0' }}
          gutter={false}
          placeholder="0"
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <FBUnitMeasures
          {...props}
          label={unitsLabel}
          gutter={false}
          name={`${name}_unit`}
        />
      </Grid>
    </Grid>
  );
};

export default FBQuantityField;
