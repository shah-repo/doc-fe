import { Box, createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { PurchaseOrder } from "../../../form.builder/FBPurchaseOrder/FBPurchaseOrder.types";
import POAttachments from "./POAttachments";
import PODetailItem from "./PODetailItem";
import POSupplier from "./POSupplier";

interface Props {
  documentRevision: DocumentRevision;
  purchaseOrder: PurchaseOrder;
  supplierId: string;
}


export const styles = makeStyles(() =>
  createStyles({
    hideBorder: {
      "&.MuiExpansionPanel-root:before": {
        display: "none",
      },
    },
  }),
);

export const PODetails: React.FunctionComponent<Props> = ({
  documentRevision,
  purchaseOrder,
  supplierId,
}) => {
  const classes = styles();
  const [isExpanded, setIsExpanded] = useState(false);
  const handleChange = () => setIsExpanded(!isExpanded);
  const renderDetails = (
    <Box>
      <PODetailItem label="common.description" value={documentRevision.name} />
      <PODetailItem label="common.line.items" value={purchaseOrder.items?.length} />
      <POAttachments documentRevision={documentRevision} />
    </Box>
  );

  return (
    <Box>
      <POSupplier supplierId={supplierId} />
      <PODetailItem label="common.total.amount" value={`${purchaseOrder.totalAmount}`} />
      <ExpansionPanel expanded={isExpanded} onChange={handleChange} className={classes.hideBorder}>
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
    </Box>
  );
};

export default PODetails;
