import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { FormattedNumber } from "react-intl";
import { FBPurchaseOrderActionsProps, FBSubmitButton } from "..";
import AlertDialog from "../../app/alert.dialog/AlertDialog";
import Text from "../../components/Text";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";
import { withFBPurchaseOrderActions } from "./FBPurchaseOrderActions.wrap";


const FBPurchaseOrderActions: React.FunctionComponent<FBPurchaseOrderActionsProps> = ({
  onAddClick,
  onCancelClick,
  onAlertNotificationCancel,
  onAlertNotificationConfirm,
  purchaseOrderState,
  isEdit,
  dialog,
}) =>
  (
    <>
      <Box display="flex" flexDirection="row-reverse" fontSize="12" mx={3} mb={1}>
        <Text translation="form.builder.total" />
        <Observer>
          {() => (
            <FormattedNumber
              value={purchaseOrderState?.itemTotalAmount || 0}
              // eslint-disable-next-line react/style-prop-object
              style="currency"
              currency={purchaseOrderState?.value.currency}
            />
          )}
        </Observer>
      </Box>
      <Box display="flex" flexDirection="row-reverse" mx={2}>
        <FBSubmitButton
          variant="outlined"
          label="common.add"
          onClick={onAddClick}
          autoFocus
        />
        <StyledCancelFBButton
          variant="outlined"
          label="common.cancel"
          onClick={onCancelClick}
        />
      </Box>
      {dialog && onAlertNotificationConfirm &&
      <AlertDialog
        confirmAction={onAlertNotificationConfirm}
        cancelAction={onAlertNotificationCancel}
        confirmLabel="common.yes.proceed"
        message={isEdit ? "documentRevision.po.notification.alert.update"
          : "documentRevision.po.notification.alert.add"}
        {...{ dialog }}
      />}
    </>
  );

export default withFBPurchaseOrderActions(FBPurchaseOrderActions);
