import { Box, Grid } from "@material-ui/core";
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

  useEffect(() => reaction(
    () => workspaceState?.poCountChanged,
    (val) => {
      // TODO check and change here
      console.log("PO CHANGED ", val);
      const formValue = formState?.getFieldValue(name, defaultValue);
      poSummary = pick(formValue, ["subTotal", "tax"]);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);


  const labelMap = {
    subTotal: "SubTotal",
    tax: "TaxTotal",
  };
  return (
    <>
      <Box style={{ maxWidth: "10vw" }}>
        <Box mb={2} style={{ fontWeight: 600 }}>
          <FBText
            locale={`Summary of totals`}
            values={{ label: "Summary" }}
          />
        </Box>
        <Box>
          <Grid container spacing={3}>
            {
              map(poSummary, (v, k) => <><Grid item xs={6}>
                <FBText
                  locale={labelMap[k]}></FBText>
              </Grid><Grid item xs={6}>
                <FormattedNumber
                  value={Number(v)}
                  // eslint-disable-next-line react/style-prop-object
                  style="currency"
                  currency={formValue?.currency} />
              </Grid></>)
            }
          </Grid>
        </Box>
        <Box>
          <hr></hr>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FBText
                locale={`Total`}></FBText>
            </Grid>
            <Grid item xs={6}>
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
