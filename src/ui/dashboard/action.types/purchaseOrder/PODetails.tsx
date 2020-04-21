import { Box, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { Attachment } from "../../../change.request/form/types";
import Text from "../../../components/Text";
import GenerateHtmlPreview from "../../../documentRevision/forms/presenters/GenerateHtmlPreview";
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleChange = () => setIsExpanded(!isExpanded);
  const renderDetails = (
    <Box>
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
      <POAttachments attachments={attachments} />
      <Box marginTop="15px" marginLeft="-15px">
        <GenerateHtmlPreview
          id={documentRevision.id}
          renderHTML={documentRevision.formDocument?.renderHTML}
        />
      </Box>
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
