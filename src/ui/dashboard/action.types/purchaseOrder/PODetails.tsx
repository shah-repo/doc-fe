import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { PurchaseOrder } from "../../../form.builder/FBPurchaseOrder/FBPurchaseOrder.types";
import { FBInputProps } from "../../../form.builder/types/common";

interface Props {
  documentRevision: DocumentRevision;
}

export const PODetails: React.FunctionComponent<Props> = ({
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

  return (
    <>
      {
        purchaseOrders.map((order, index) => (
          <Box marginTop="5px" key={index}>
            <Box marginBottom="5px">
              <Box component="span" fontWeight="fontWeightBold">
                <Text translation="common.total.amount" />
                {": "}
              </Box>
              <Box component="span">${order.totalAmount}</Box>
            </Box>
            <Box marginBottom="5px">
              <Box component="span" fontWeight="fontWeightBold">
                <Text translation="common.description" />
                {": "}
              </Box>
              <Box component="span">{documentRevision.name}</Box>
            </Box>
            <Box marginBottom="5px">
              <Box component="span" fontWeight="fontWeightBold">
                <Text translation="common.line.items" />
                {": "}
              </Box>
              <Box component="span">{order.items.length}</Box>
            </Box>
          </Box>
        ))
      }
    </>
  );
};

export default PODetails;
