import { Box, createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { stripTags } from "../../../../common/utils/helpers";
import { Attachment } from "../../../../state/ducks/attachments/types";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../components/Text";
import { FBPurchaseOrderValue } from "../../../form.builder";
import POAttachments from "./POAttachments";
import PODetailItem from "./PODetailItem";
import POSupplier from "./POSupplier";

interface Props {
  documentRevision: DocumentRevision;
  purchaseOrder: FBPurchaseOrderValue;
  supplierId: string;
  docRevAttachments: Attachment[];
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
  docRevAttachments,
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
      <PODetailItem label="common.description" value={stripTags(documentRevision.description)} />
      <PODetailItem label="common.line.items" value={purchaseOrder.items?.length || 0} />
      <POAttachments {...{ docRevAttachments }} />
    </Box>
  );

  return (
    <Box>
      <POSupplier supplierId={supplierId} />
      <PODetailItem label="common.total.amount" value={`${totalAmount}`} />
      {/* Assigned date removed per requirements in ENC-8154 */}
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
