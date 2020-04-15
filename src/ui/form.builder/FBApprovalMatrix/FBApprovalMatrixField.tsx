import { Box, Dialog, DialogContent } from "@material-ui/core";
import React, { useEffect } from "react";
import useDialog from "../../hooks/useDialog";
import FBApprovalMatrixTable from "../components/custom/FBApprovalMatrixTable";
import FBButton from "../components/inputs/FBButton";
import FBStore from "../stores/ui/FBStore";
import ApprovalMatrixSectionBox from "./ApprovalMatrixSectionBox";


export interface PurchaseOrderItem {
  order: number;
  units: string;
  partNumber: string;
  date: Date;
  description: string;
  unitPrice: number;
  tax: boolean;
  isTraceabilityRequired: boolean;
  capitalEquipment: boolean;
}

export interface PurchaseOrder {
  items: PurchaseOrderItem[];
  shippingCost: number | undefined;
}

const FBapprovalMatrixField: React.FunctionComponent<any> = ({
  label,
  disabled,
  ...props
}) => {
  const storeValue = FBStore.getValues()[props.name] || { items: [], shippingCost: undefined };
  const dialog = useDialog();

  useEffect(() => {
    if (!storeValue) {
      FBStore.setValues({
        ...FBStore.getValues(),
        [props.name]: { items: [], shippingCost: undefined },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editItem = (index: number) => {
    // workaround need to calculate total cost when editing item
    FBStore.setValues({
      ...FBStore.getValues(),
      ...storeValue.items[index],
    });
    dialog.open();
  };

  const deleteItem = (index: number) => {
    const filtered = (storeValue.items || [])
      .filter((order, i) => i !== index)
      .map((value, index) => ({ ...value, index: index + 1 }));

    FBStore.setValues({
      ...FBStore.getValues(),
      [props.name]: {
        ...storeValue,
        items: [...filtered],
      },
    });
  };

  return (
    <Box mt={3}>
      <ApprovalMatrixSectionBox label={label} isOpen={dialog.isOpen} openDialog={() => dialog.open()} closeDialog={() => dialog.close()}/>
      <FBApprovalMatrixTable
        values={storeValue.items}
        editItem={editItem}
        deleteItem={deleteItem}
        disabled={disabled}
      />
      <FBButton
        fullWidth={true}
        disabled={disabled}
        label="form.builder.add.item"
        variant="outlined"
        style={{ margin: "8px 0" }}
      />
      <Dialog fullScreen={true} open={dialog.isOpen}>
        <DialogContent>
          <ApprovalMatrixSectionBox label={label} isOpen={dialog.isOpen} openDialog={() => dialog.open()} closeDialog={() => dialog.close()} alreadyOpened={true}/>
          <FBApprovalMatrixTable
            values={storeValue.items}
            editItem={editItem}
            deleteItem={deleteItem}
            disabled={disabled}
          />
          <FBButton
            fullWidth={true}
            disabled={disabled}
            label="form.builder.add.item"
            variant="outlined"
            style={{ margin: "8px 0" }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FBapprovalMatrixField;
