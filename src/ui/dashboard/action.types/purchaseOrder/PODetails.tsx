import { Box, createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { FBPurchaseOrderValue } from "../../../form.builder";
import POAssignedDate from "./POAssignedDate";
import POAttachments from "./POAttachments";
import PODetailItem from "./PODetailItem";
import POSupplier from "./POSupplier";

interface Props {
  documentRevision: DocumentRevision;
  purchaseOrder: FBPurchaseOrderValue;
  supplierId: string;
}


const styles = makeStyles(() =>
  createStyles({
    hideBorder: {
      "&.MuiExpansionPanel-root:before": {
        display: "none",
      },
    },
  }),
);

const PODetails: React.FunctionComponent<Props> = ({
  documentRevision,
  purchaseOrder,
  supplierId,
}) => {
  const intl = useIntl();
  const totalAmount = useMemo(() => {
    const currency = purchaseOrder.currency || "USD";
    return intl.formatNumber(Number(purchaseOrder.totalAmount), { style: "currency", currency });
  }, [intl, purchaseOrder.totalAmount, purchaseOrder.currency]);
  const classes = styles();
  const [isExpanded, setIsExpanded] = useState(false);
  const handleChange = () => setIsExpanded(!isExpanded);
  const renderDetails = (
    <Box>
      <PODetailItem label="common.description" value={documentRevision.name} />
      <PODetailItem label="common.line.items" value={purchaseOrder.items?.length || 0} />
      <POAttachments documentRevision={documentRevision} />
    </Box>
  );

  return (
    <Box>
      <POSupplier supplierId={supplierId} />
      <PODetailItem label="common.total.amount" value={`${totalAmount}`} />
      <POAssignedDate approvals={documentRevision.changeRequest?.approvals} />
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
