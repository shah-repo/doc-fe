import { Box } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import POActions from "./POActions";
import PODetails from "./PODetails";

interface Props {
  documentRevision: DocumentRevision;
}

export const PODetailsContainer: React.FunctionComponent<Props> = ({
  documentRevision,
}) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="flex-start"
    marginTop="20px"
  >
    <PODetails documentRevision={documentRevision} />
    <POActions documentRevision={documentRevision} />
  </Box>
);

export default PODetailsContainer;
