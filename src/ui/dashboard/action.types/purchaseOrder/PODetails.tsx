import { Box } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { Attachment } from "../../../change.request/form/types";
import Text from "../../../components/Text";
import { PurchaseOrder } from "../../../form.builder/FBPurchaseOrder/FBPurchaseOrder.types";
import POAttachments from "./POAttachments";

interface Props {
  documentRevision: DocumentRevision;
  purchaseOrders: PurchaseOrder[];
  attachments?: Attachment[];
}

export const PODetails: React.FunctionComponent<Props> = ({
  documentRevision,
  purchaseOrders,
  attachments = [],
}) => (
  <Box>
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
    <POAttachments attachments={attachments} />
  </Box>
);

export default PODetails;
