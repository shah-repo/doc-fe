import { Box, Button } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { documentPreviewPath } from "../../../document.revision/utils/paths";
import PODetailsContainer from "./PODetailsContainer";

interface Props {
  key: number;
  documentRevision?: DocumentRevision;
}

export const PurchaseOrderApproval: React.FunctionComponent<Props> = ({
  key,
  documentRevision,
}) => {
  if (!documentRevision) {
    return null;
  }


  return (
    <Box marginBottom="10px" marginTop="10px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Box color="primary.main" fontWeight="fontWeightBold" marginBottom="5px">
            PURCHASE ORDER: PO00771, Rev 2
          </Box>
          <Box>Purchase order from XY is pending your approval</Box>
        </Box>
        <Button
          variant="contained"
          target="_blank"
          href={documentPreviewPath(documentRevision.id, documentRevision.document.id)}
          color="secondary"
          id={`PurchaseOrderApproval-open-${key}`}
        >
          <Text translation="common.open" />
        </Button>
      </Box>
      <PODetailsContainer documentRevision={documentRevision} />
    </Box>
  );
};

export default PurchaseOrderApproval;
