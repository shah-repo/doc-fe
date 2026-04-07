import { Box, Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { map, pick } from 'lodash';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBPurchaseOrderProps } from '..';
import { translate } from '../../../common/intl';
import { PO_ITEMS_COMPONENT_NAME } from '../../../state/ducks/documentRevisions/constants';
import { DOC_TYPE_GROUP } from '../../../state/ducks/documentRevisions/documentType/types';
import FormattedNumber from '../../components/FormattedNumber';
import Colors from '../../layout/theme/utils/colors';
import FBStore from '../FBStore/FBStore';

const KEYS_TO_PICK = ['subTotal', 'tax', 'shippingCost', 'currency', 'totalAmount'];
const KEYS_TO_RENDER = ['subTotal', 'tax', 'shippingCost'];

const LABELS = {
  subTotal: 'common.summary.sub.total',
  tax: 'common.summary.tax',
  shippingCost: 'common.summary.shipping.cost',
};

const FBPurchaseOrderSummary: React.FC<FBPurchaseOrderProps> = ({
  defaultValue,
  lineItem = PO_ITEMS_COMPONENT_NAME,
}) => {
  const { formState, workspaceState } = FB.useStores();

  const poSummary = useObserver(() => {
    const formValue = FBStore?.purchaseOrderValue ?? formState?.getFieldValue(lineItem, defaultValue) ?? {};
    return {
      subTotal: 0,
      tax: 0,
      currency: 'USD',
      totalAmount: 0,
      ...pick(formValue, KEYS_TO_PICK),
    };
  });

  if (workspaceState?.document?.document.documentType.group === DOC_TYPE_GROUP.RECEIVABLE) {
    return null;
  }

  return (
    <Box color={Colors.almost_black} width={242} fontSize={12}>
      <Box mb={1.25} fontWeight={600} fontSize={12} data-cy="common.summary.total">
        {translate('common.summary.total')}
      </Box>
      <Box pl={2.75} pr={3.125} pt={3.5} pb={4.75} bgcolor={Colors.white}>
        <Box>
          {map(pick(poSummary, KEYS_TO_RENDER), (value, key) => (
            <Grid container spacing={3} alignItems="center" justify="space-between"
              style={{ marginBottom: key !== 'shippingCost' ? 8 : 0 }}>
              <Grid item xs="auto" data-cy={LABELS[key]}>
                {translate(LABELS[key])}
              </Grid>
              <Grid item xs="auto">
                <Box fontWeight={600}>
                  <FormattedNumber
                    value={Number(value)}
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                    currency={poSummary?.currency} />
                </Box>
              </Grid>
            </Grid>))}
        </Box>
        <Divider style={{ marginTop: 8, marginBottom: 20 }} />
        <Box>
          <Grid container spacing={3} alignItems="center" justify="space-between">
            <Grid item xs="auto" data-cy="form.builder.grand.total">
              {translate('form.builder.grand.total')}
            </Grid>
            <Grid item xs="auto">
              <Box fontWeight={600}>
                <FormattedNumber
                  value={Number(poSummary?.totalAmount)}
                  // eslint-disable-next-line react/style-prop-object
                  style="currency"
                  currency={poSummary?.currency}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FBPurchaseOrderSummary;
