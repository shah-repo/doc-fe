import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
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
    const isSchemaArray = Array.isArray(schema);
    if (!isSchemaArray) {
      return [];
    }
    return (schema as FBInputProps[]).reduce<PurchaseOrder[]>((acc, { type, name }) => {
      if (((type) !== "purchaseorder")) {
        return acc;
      }
      if (name === undefined) {
        return acc;
      }
      if (!documentRevision.formInput) {
        return acc;
      }
      if (!documentRevision.formInput[name]) {
        return acc;
      }
      return acc.concat(documentRevision.formInput[name]);
    }, []);
  });
  const [supplierId] = useState(() => {
    const schema = documentRevision.formDocument?.formTemplate?.schema;
    const isSchemaArray = Array.isArray(schema);
    if (!isSchemaArray || !documentRevision.formInput) {
      return "";
    }

    const fieldName = (schema as FBInputProps[]).find((schemaItem) => schemaItem.optionId === "5")?.name;
    if (!fieldName) {
      return "";
    }

    return documentRevision.formInput[fieldName];
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
