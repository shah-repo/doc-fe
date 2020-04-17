import { Box } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";

interface Props {
  documentRevision: DocumentRevision;
}

export const PODetails: React.FunctionComponent<Props> = ({
  documentRevision,
}) => (
  <Box marginTop="5px">
    <Box marginBottom="5px">
      <Box component="span" fontWeight="fontWeightBold">Supplier: </Box>
      <Box component="span">Quality Circuits</Box>
    </Box>
    <Box marginBottom="5px">
      <Box component="span" fontWeight="fontWeightBold">Total: </Box>
      <Box component="span">$5200</Box>
    </Box>
    <Box marginBottom="5px">
      <Box component="span" fontWeight="fontWeightBold">Description: </Box>
      <Box component="span">Flex Circuits</Box>
    </Box>
  </Box>
);

export default PODetails;

