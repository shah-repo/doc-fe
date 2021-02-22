import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { FBAutocompleteAsyncOption, FBPurchaseOrderValue } from "../../../form.builder";
import { FBInputProps } from "../../../form.builder/types/common";
import POActions from "./POActions";
import PODetails from "./PODetails";

interface Props {
  documentRevision: DocumentRevision;
}

const PODetailsContainer: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const [purchaseOrder] = useState<FBPurchaseOrderValue>(() => {
    const schema = documentRevision.formDocument?.formTemplate?.schema;

    const fieldName = (schema as FBInputProps[])
      .find((schemaItem) => schemaItem.type === "purchaseorder")
      ?.name;

    return documentRevision.formInput?.[fieldName || ""] || {};
  });
  const [supplierId] = useState(() => {
    const schema = documentRevision.formDocument?.formTemplate?.schema;

    const fieldName = (schema as FBInputProps[])
      .find((schemaItem) => schemaItem.optionId === FBAutocompleteAsyncOption.suppliers)
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
        purchaseOrder={purchaseOrder}
        supplierId={supplierId}
      />
      <POActions documentRevision={documentRevision} />
    </Box>
  ); };

export default PODetailsContainer;
