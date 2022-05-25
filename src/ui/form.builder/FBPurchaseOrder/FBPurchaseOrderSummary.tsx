import { Box, Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { map, pick } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { FormattedNumber } from "react-intl";
import { FB, FBPurchaseOrderProps, FBText } from "..";

const FBPurchaseOrderSummary: React.FunctionComponent<FBPurchaseOrderProps> = ({ defaultValue, name, ...props }) => {
  const { formState } = FB.useStores();
  const formValue = formState?.getFieldValue(name, defaultValue);
  let poSummary = pick(formValue, ["subTotal", "tax"]);

  const { workspaceState } = FB.useStores();
  const lableStyle = { fontSize: 12, fontWeight: 400 };
  const amountStyle = { fontSize: 12, fontWeight: 600 };

  useEffect(() => reaction(
    () => workspaceState?.poCountChanged,
    (val) => {
      // TODO check and change here
      const formValue = formState?.getFieldValue(name, defaultValue);
      poSummary = pick(formValue, ["subTotal", "tax"]);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);


  const labelMap = {
    subTotal: "SubTotal",
    tax: "Tax Total",
  };
  return (
    <>
      <Box style={{ maxWidth: "11vw" }}>
        <Box mb={1.25} style={{ fontWeight: 600, fontSize: 12 }}>
          <FBText
            locale={`Summary of totals`}
            values={{ label: "Summary" }}
          />
        </Box>
        <Box  pl={2.75} >
          <Grid container spacing={3}>
            {
              map(poSummary, (v, k) => <><Grid style={{ ...lableStyle }} item xs={6}>
                <FBText
                  locale={labelMap[k]}></FBText>
              </Grid><Grid item xs={6} style={{ ...amountStyle }}>
                <FormattedNumber
                  value={Number(v)}
                  // eslint-disable-next-line react/style-prop-object
                  style="currency"
                  currency={formValue?.currency} />
              </Grid></>)
            }
          </Grid>
        </Box>
        <Box pl={2.75}>
          <Divider style={{ marginTop: 20, marginBottom: 20 }}></Divider>
          <Grid container spacing={3}>
            <Grid item xs={6} style={{ ...lableStyle }}>
              <FBText
                locale={`Grand Total`}></FBText>
            </Grid>
            <Grid item xs={6} style={{ ...amountStyle }}>
              <FormattedNumber
                value={Number(formValue?.totalAmount)}
                // eslint-disable-next-line react/style-prop-object
                style="currency"
                currency={formValue?.currency}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  ); };

export default FBPurchaseOrderSummary;
