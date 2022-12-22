import { Box, Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { map, pick } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { FormattedNumber } from "react-intl";
import { FB, FBPurchaseOrderProps, FBText } from "..";
import SM from "../../../App/Shifamed/Utils/SM/SM";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import Colors from "../../layout/theme/utils/colors";
import FBStore from "../FBStore/FBStore";

const FBPurchaseOrderSummary: React.FunctionComponent<FBPurchaseOrderProps> = ({ defaultValue, name, ...props }) => {
  const requiredKeys = ["subTotal", "tax", "shippingCost", "currency", "totalAmount"];
  const { formState, workspaceState } = FB.useStores();
  const { _tabsState } = SM.useStores();
  const formInputName = props?.lineItem ? props?.lineItem : "po-items-built-in";
  const formValue = formState?.getFieldValue(formInputName, defaultValue);
  const [poSummary, setPoSummary] = React.useState(formValue ? pick(formValue, requiredKeys) : {
    subTotal: 0,
    tax: 0,
    currency: "USD",
    totalAmount: 0,
  });


  useEffect(() => reaction(
    () => _tabsState?.activeTabId,
    () => {
      const formValue = FBStore?.purchaseOrderValue || formState?.getFieldValue("po-items-built-in", defaultValue);
      const poSummaryObj = pick(formValue, requiredKeys);
      setPoSummary(poSummaryObj);
    }
  ));

  const labelMap = {
    subTotal: "SubTotal",
    tax: "Tax Total",
    shippingCost: "Shipping Cost",
  };

  if (workspaceState?.document?.document.documentType.group === DOC_TYPE_GROUP.RECEIVABLE)  {
    return null;
  }

  return (
    <Box color={Colors.almost_black} width={242} fontSize={12}>
      <Box mb={1.25} fontWeight={600} fontSize={12}>
        <FBText locale="common.summary.total" />
      </Box>
      <Box pl={2.75} pr={3.125} pt={3.5} pb={4.75} bgcolor={Colors.white}>
        <Box>
          {map(pick(poSummary, ["subTotal", "tax", "shippingCost"]), (value, key) => (
            <Grid container spacing={3} alignItems="center" justify="space-between"
              style={{ marginBottom: key === "shippingCost" ? 8 : 0 }}>
              <Grid item xs="auto">
                <FBText locale={labelMap[key]}></FBText>
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
        <Divider style={{ marginTop: 8, marginBottom: 20 }}></Divider>
        <Box>
          <Grid container spacing={3} alignItems="center" justify="space-between">
            <Grid item xs="auto">
              <FBText locale="form.builder.grand.total"></FBText>
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
  ); };

export default FBPurchaseOrderSummary;
