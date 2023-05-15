import { Grid } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { FormattedNumber } from 'react-intl';
import { FBData, FBSelect, FBTableCell, FBTextField } from '..';
import { FormContext } from '../../components/forms/FormContext';
import { FBTableCellStyles } from '../styles/FBTableCell.styles';
import FBPurchaseOrderExchange from './FBPurchaseOrder.exchange';
import { FBPurchaseOrderTableTotalProps } from './FBPurchaseOrderTable.types';

const FBPurchaseOrderTableTotal: React.FunctionComponent<FBPurchaseOrderTableTotalProps> = ({
  handleShippingCostChange,
  handleCurrencyChange,
  calculation,
  handleTaxChange,
  handleTaxRateChange,
  reCalculateValueOnBlur,
  disabled,
  name,
}) => {
  const cellStyle = FBTableCellStyles();
  return (
    <React.Fragment>
      <TableRow className={cellStyle.cell}>
        <FBTableCell rowSpan={7} colSpan={6} className={cellStyle.cellEmpty} />
        <FBTableCell label="form.builder.currency" colSpan={2}
          align="left"
          className={`FBTotal-root ${cellStyle.cellHeader}`}
        />
        <FBTableCell className="FBTotal-root" colSpan={2}>
          <FormContext.Provider value={{ submitOnChange: false }}>
            <FBSelect
              name={`${name}.currency`}
              onChange={handleCurrencyChange}
              options={FBData.currencyOptions}
              gutter={false}
              SelectDisplayProps={{ style: { padding: '5px 30px 5px 2px' } }}
              {...{ disabled }}
            />
          </FormContext.Provider>
        </FBTableCell>
      </TableRow>
      <TableRow className={cellStyle.cell}>
        <FBTableCell label="form.builder.subTotal" align="left" colSpan={2}
          className={`FBTotal-root ${cellStyle.cellHeader}`}
        />
        <FBTableCell className={`FBTotal-root ${cellStyle.cellHeader}`} colSpan={2} align="right">
          <FormattedNumber
            value={Number(calculation?.subTotal)}
            // eslint-disable-next-line react/style-prop-object
            style="currency"
            currency={calculation?.currency}
          />
        </FBTableCell>
      </TableRow>
      <TableRow className={cellStyle.cell}>
        <FBTableCell label="form.builder.tax.rate"
          colSpan={2}
          align="left"
          className={`FBTotal-root ${cellStyle.cellHeader}`}
        />
        <FBTableCell className={`FBTotal-root ${cellStyle.cellValueHeight}`} align="right" colSpan={2}>
          <Grid container>
            <Grid item xs={11}>
              <FBTextField
                name={`${name}.taxRate`}
                gutter={false}
                type="number"
                size="small"
                customHeight={25}
                value={calculation?.taxRate}
                inputProps={{
                  style: {
                    padding: '5px',
                    textAlign: 'right',
                  },
                  step: '.01',
                  min: '0',
                  onChange: handleTaxRateChange,
                  onBlur: reCalculateValueOnBlur,
                }}
                rules="min:0"
                {...{ disabled }}
              />
            </Grid>
            <Grid item xs={1} style={{ paddingLeft: '8px', margin: 'auto' }}>
              %
            </Grid>
          </Grid>
        </FBTableCell>
      </TableRow>
      <TableRow className={cellStyle.cell}>
        <FBTableCell label="form.builder.tax"
          align="left"
          className={`FBTotal-root ${cellStyle.cellHeader}`}
          colSpan={2}
        />
        <FBTableCell
          align="right" colSpan={2}
          className={`FBTotal-root ${cellStyle.cellFontWeightHigh} ${cellStyle.cellFontWeightLow} 
            ${cellStyle.cellValueHeight}`}
        >
          <FBTextField
            name={`${name}.tax`}
            gutter={false}
            type="number"
            size="small"
            customHeight={25}
            value={calculation?.tax}
            inputProps={{
              style: {
                padding: '5px',
                textAlign: 'right',
              },
              step: '.01',
              min: '0',
              onChange: handleTaxChange,
              onBlur: reCalculateValueOnBlur,
            }}
            rules="min:0"
            {...{ disabled }}
          />
        </FBTableCell>
      </TableRow>
      <TableRow className={cellStyle.cell}>
        <FBTableCell label="form.builder.shipping.cost" align="left"
          colSpan={2}
          className={`FBTotal-root ${cellStyle.cellHeader}`}
        />
        <FBTableCell className="FBTotal-root" colSpan={2} align="right">
          <FBTextField
            name={`${name}.shippingCost`}
            gutter={false}
            type="number"
            size="small"
            customHeight={25}
            value={calculation?.shippingCost}
            inputProps={{
              style: {
                padding: '5px',
                textAlign: 'right',
              },
              step: '.01',
              min: '0',
              onChange: handleShippingCostChange,
              onBlur: reCalculateValueOnBlur,
            }}
            rules="min:0"
            {...{ disabled }}
          />
        </FBTableCell>
      </TableRow>
      <TableRow className={cellStyle.cell}>
        <FBTableCell label="form.builder.grand.total" align="left"
          colSpan={2}
          className={`FBTotal-root
            ${cellStyle.cellHeader}`}
        />
        <FBTableCell
          colSpan={2} data-cy="poTotal"
          align="right"
          className={`FBTotal-root ${cellStyle.cellHeader}`}
        >
          <FormattedNumber
            value={Number(calculation?.totalAmount)}
            // eslint-disable-next-line react/style-prop-object
            style="currency"
            currency={calculation?.currency}
          />
        </FBTableCell>
      </TableRow>
      {
        calculation?.currency !== 'USD'
        && <TableRow className={cellStyle.cell}>
          <FBTableCell colSpan={5}
            align="right"
            className={`FBTotal-root ${cellStyle.cellFontWeightHigh} ${cellStyle.cellFontWeightLow}`}
          >
            <FBPurchaseOrderExchange {...{ calculation }} />
          </FBTableCell>
        </TableRow>
      }
    </React.Fragment>
  );
};

export default FBPurchaseOrderTableTotal;
