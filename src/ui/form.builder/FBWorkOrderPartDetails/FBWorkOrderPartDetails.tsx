import { Grid } from '@material-ui/core';
import { kebabCase } from 'lodash';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBInputProps, FBTextField, FBWorkspaceModeOptions } from '..';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from '../../form.builder';
import FBUnitMeasures from '../FBUnitMeasures/FBUnitMeasures';
import { PART_TO_BE_MADE } from './constants';

const FBWorkOrderPartDetails: React.FC<FBInputProps> = ({
  name = '',
  label,
  type,
  ...props
}) => {
  const { formState, workspaceState } = FB.useStores();

  const isPreview = formState?.workspaceMode === FBWorkspaceModeOptions.PREVIEW;
  const cyName = kebabCase(name);
  const partsDefaultValue = useObserver(() => (workspaceState?.formInputSync?.get(PART_TO_BE_MADE)));
  const unitsDefaultValue = useObserver(() => (workspaceState?.formInputSync?.get(`${name}_unit`)));
  const quantityDefaultValue = useObserver(() => (workspaceState?.formInputSync?.get(`${name}_quantity`)));

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <FBAutocompleteAsync
          {...props}
          name={PART_TO_BE_MADE}
          label={label ?? 'form.builder.wo.part.selector'}
          placeholder="form.builder.select"
          optionId={FBAutocompleteAsyncOption.availableParts}
          optionValueType="id"
          defaultValue={partsDefaultValue}
          type={type}
          disabled={props.disabled}
          withState={true}
          autosave={true}
        />
      </Grid>
      <Grid item md={3} xs={6}>
        <FBTextField
          {...props}
          dataCy={`${cyName}-quantity`}
          label="form.builder.wo.part.quantity"
          name={`${name}_quantity`}
          type="number"
          defaultValue={quantityDefaultValue}
          inputProps={{ min: '1' }}
          gutter={false}
          showErrorMsg={false}
          placeholder="1"
        />
      </Grid>
      <Grid item md={3} xs={6}>
        {isPreview ? (
          <FBTextField
            {...props}
            dataCy={`${cyName}-unit`}
            label="form.builder.field.units"
            name={`${name}_unit`}
            gutter={false}
            placeholder="0"
          />
        ) : (
          <FBUnitMeasures
            {...props}
            label="form.builder.field.units"
            gutter={false}
            defaultValue={unitsDefaultValue}
            name={`${name}_unit`}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default FBWorkOrderPartDetails;
