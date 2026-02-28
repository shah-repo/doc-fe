import { Box, InputAdornment } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { FBEditor, FBEditorLabel, FBEditorProps, FBTextField } from '..';
import { translate } from '../../../common/intl';
import { companySelectors } from '../../../state/ducks/company';
import { TAX_RATE } from '../helpers/constants';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';

const FBEditorPurchaseOrder: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => {
  const companyTaxRate = useSelector(companySelectors.getCompanyDefaultTaxRate);
  const defaultTaxRate = companyTaxRate ?? TAX_RATE;

  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBEditorLabel {...props} {...{ inputProps }} standalone={true} />
      <Box mb={3.125}>
        <FBTextField
          label="form.builder.tax.rate"
          name="editorConfig.taxRate"
          type="number"
          placeholder={translate('form.builder.tax.rate.editor.placeholder', { value: defaultTaxRate })}
          labelProps={AutoCompleteStyles.labelProps}
          inputProps={{ min: 0, step: 0.01 }}
          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          isFbEditorField
        />
      </Box>
      {children}
    </FBEditor>
  );
};

export default FBEditorPurchaseOrder;
