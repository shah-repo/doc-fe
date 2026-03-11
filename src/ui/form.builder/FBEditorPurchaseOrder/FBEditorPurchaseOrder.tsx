import { Box, InputAdornment } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { FBEditor, FBEditorLabel, FBEditorProps, FBTextField } from '..';
import { companySelectors } from '../../../state/ducks/company';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';

const FBEditorPurchaseOrder: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => {
  const companyTaxRate = useSelector(companySelectors.getCompanyDefaultTaxRate);

  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBEditorLabel {...props} {...{ inputProps }} standalone={true} />
      <Box mb={3.125}>
        <FBTextField
          label="form.builder.tax.rate"
          name="editorConfig.taxRate"
          type="number"
          placeholder={companyTaxRate.toString()}
          labelProps={AutoCompleteStyles.labelProps}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          isFbEditorField
        />
      </Box>
      {children}
    </FBEditor>
  );
};

export default FBEditorPurchaseOrder;
