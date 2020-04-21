import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { FBAutocompleteAsyncOption } from "../../../form.builder";
import { PurchaseOrder } from "../../../form.builder/FBPurchaseOrder/FBPurchaseOrder.types";
import { FBInputProps } from "../../../form.builder/types/common";
import POActions from "./POActions";
import PODetails from "./PODetails";

interface Props {
  documentRevision: DocumentRevision;
}

export const PODetailsContainer: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const [purchaseOrders] = useState<PurchaseOrder[]>(() => {
    const schema = documentRevision.formDocument?.formTemplate?.schema;
    return (schema as FBInputProps[]).reduce<PurchaseOrder[]>((acc, { type, name }) => {
      if ((type === "purchaseorder") && name && documentRevision.formInput?.[name]) {
        return acc.concat(documentRevision.formInput[name]);
      }
      return acc;
    }, []);
  });
  const [supplierId] = useState(() => {
    const schema = documentRevision.formDocument?.formTemplate?.schema;

    const fieldName = (schema as FBInputProps[])
      .find((schemaItem) => schemaItem.optionId === FBAutocompleteAsyncOption.supplier)
      ?.name;

    return documentRevision.formInput?.[fieldName || ""];
  });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      marginTop="20px"
    >
      <PODetails
        documentRevision={documentRevision}
        purchaseOrders={purchaseOrders}
        attachments={documentRevision.formInput?.attachments}
        supplierId={supplierId}
      />
      <POActions documentRevision={documentRevision} />
    </Box>
  ); };

export default PODetailsContainer;
