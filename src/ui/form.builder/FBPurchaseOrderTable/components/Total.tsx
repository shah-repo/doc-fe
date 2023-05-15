import { Box, Divider } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { FormattedNumber } from 'react-intl';
import { FBData, FBSelect, FBTextField } from '../..';
import Text from '../../../components/Text';
import useStyles from '../styles';
import { FBPurchaseOrderTableTotalProps } from '../types';
import Exchange from './Exchage';

const Total: React.FC<FBPurchaseOrderTableTotalProps> = ({
  handleShippingCostChange,
  handleCurrencyChange,
  handleTaxChange,
  handleTaxRateChange,
  reCalculateValueOnBlur,
  calculation,
  disabled,
  name = '',
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.calculation}>
      <Box className={cx({ [classes.calculationFields]: !disabled })}>
        <Box className={classes.calculationItem}>
          <Box className={classes.calculationLabel}>
            <Text message="form.builder.currency" />
          </Box>
          <Box className={classes.calculationField}>
            <FBSelect
              name={`${name}.currency`}
              onChange={handleCurrencyChange}
              options={FBData.currencyOptions}
              gutter={false}
              SelectDisplayProps={{
                className: classes.calculationSelect,
              }}
              disabled={disabled}
            />
          </Box>
        </Box>
        <Box className={classes.calculationItem}>
          <Box className={classes.calculationLabel}>
            <Text message="form.builder.subTotal" />
          </Box>
          <Box className={cx(classes.calculationField, classes.calculationTotal)}>
            <FormattedNumber
              value={Number(calculation?.subTotal)}
              style="currency"
              currency={calculation?.currency}
            />
          </Box>
        </Box>
        <Box className={classes.calculationItem}>
          <Box className={classes.calculationLabel}>
            <Text message="form.builder.tax.rate" />
          </Box>
          <Box className={classes.calculationField}>
            <Box className={classes.calculationTax}>
              <FBTextField
                name={`${name}.taxRate`}
                gutter={false}
                type="number"
                size="small"
                customHeight={25}
                value={calculation?.taxRate}
                inputProps={{
                  className: classes.calculationInput,
                  step: 0.01,
                  min: 0,
                  onChange: handleTaxRateChange,
                  onBlur: reCalculateValueOnBlur,
                }}
                rules="min:0"
                disabled={disabled}
              />
              %
            </Box>
          </Box>
        </Box>
        <Box className={classes.calculationItem}>
          <Box className={classes.calculationLabel}>
            <Text message="form.builder.tax" />
          </Box>
          <Box className={classes.calculationField}>
            <FBTextField
              name={`${name}.tax`}
              gutter={false}
              type="number"
              size="small"
              customHeight={25}
              value={calculation?.tax}
              inputProps={{
                className: classes.calculationInput,
                step: 0.01,
                min: 0,
                onChange: handleTaxChange,
                onBlur: reCalculateValueOnBlur,
              }}
              rules="min:0"
              disabled={disabled}
            />
          </Box>
        </Box>
        <Box className={classes.calculationItem}>
          <Box className={classes.calculationLabel}>
            <Text message="form.builder.shipping.cost" />
          </Box>
          <Box className={classes.calculationField}>
            <FBTextField
              name={`${name}.shippingCost`}
              gutter={false}
              type="number"
              size="small"
              customHeight={25}
              value={calculation?.shippingCost}
              inputProps={{
                className: classes.calculationInput,
                step: 0.01,
                min: 0,
                onChange: handleShippingCostChange,
                onBlur: reCalculateValueOnBlur,
              }}
              rules="min:0"
              disabled={disabled}
            />
          </Box>
        </Box>
        <Divider className={classes.calculationDivider} />
        <Box className={classes.calculationItem}>
          <Box className={classes.calculationLabel}>
            <Text message="form.builder.grand.total" />
          </Box>
          <Box className={cx(classes.calculationField, classes.calculationTotal)}>
            <FormattedNumber
              value={Number(calculation?.totalAmount)}
              style="currency"
              currency={calculation?.currency}
            />
          </Box>
        </Box>
      </Box>
      {calculation?.currency !== 'USD' && (
        <Box className={classes.calculationExcange}>
          <Divider className={classes.calculationDivider} />
          <Exchange {...{ calculation }} />
        </Box>
      )}
    </Box>
  );
};

export default Total;
