import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { Attachment } from "../../../../state/ducks/attachments/types";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import { FBInputProps, FBPurchaseOrderValue } from "../../../form.builder";
import POActions from "./POActions";
import PODetails from "./PODetails";

interface Props {
  documentRevision: DocumentRevision;
  docRevAttachments: Attachment[];
}

const PODetailsContainer: React.FunctionComponent<Props> = ({
  documentRevision,
  docRevAttachments,
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
      .find((schemaItem) => schemaItem.type === "supplier")
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
        {...{
          documentRevision,
          purchaseOrder,
          supplierId,
          docRevAttachments,
        }}
      />
      <POActions documentRevision={documentRevision} />
    </Box>
  ); };

export default PODetailsContainer;
