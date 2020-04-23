import { Box, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { PurchaseOrder } from "../../../form.builder/FBPurchaseOrder/FBPurchaseOrder.types";
import POAttachments from "./POAttachments";
import POSupplier from "./POSupplier";

interface Props {
  documentRevision: DocumentRevision;
  purchaseOrders: PurchaseOrder[];
  supplierId: string;
}

export const PODetails: React.FunctionComponent<Props> = ({
  documentRevision,
  purchaseOrders,
  supplierId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleChange = () => setIsExpanded(!isExpanded);
  const renderDetails = (
    <Box>
      <POSupplier supplierId={supplierId} />
      {
        purchaseOrders.map((order, index) => (
          <Box key={index}>
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
      <POAttachments documentRevision={documentRevision} />
    </Box>
  );

  return (
    <ExpansionPanel expanded={isExpanded} onChange={handleChange}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon color="primary" />}
        style={{ width: "100px" }}
      >
        <Box color="primary.main" fontWeight="bold" style={{ textTransform: "uppercase" }}>
          <Text translation="common.summary" />
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {renderDetails}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default PODetails;
