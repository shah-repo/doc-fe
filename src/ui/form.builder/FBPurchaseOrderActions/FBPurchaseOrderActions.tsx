import { Box } from "@material-ui/core";
import React from "react";
import { FormattedNumber } from "react-intl";
import { FBButton, FBPurchaseOrderActionsProps, FBSubmitButton } from "..";
import Text from "../../components/Text";
import { withFBPurchaseOrderActions } from "./FBPurchaseOrderActions.wrap";


const FBPurchaseOrderActions: React.FunctionComponent<FBPurchaseOrderActionsProps> = ({
  onAddClick,
  onCancelClick,
  totalPrice = 0,
  currency,
  ...props
}) => (
  <>
    <Box display="flex" flexDirection="row-reverse" fontSize="h6.fontSize" mx={3} mb={1}>
      <Text translation="form.builder.total" />
      <FormattedNumber
        value={totalPrice}
        // eslint-disable-next-line react/style-prop-object
        style="currency"
        currency={currency}
      />
    </Box>
    <Box display="flex" flexDirection="row-reverse" mx={2}>
      <FBSubmitButton
        variant="outlined"
        label="common.add"
        onClick={onAddClick}
        autoFocus
      />
      <FBButton
        variant="outlined"
        label="common.cancel"
        onClick={onCancelClick}
      />
    </Box>
  </>
);

export default withFBPurchaseOrderActions(FBPurchaseOrderActions);
