import { Box, Button, createStyles, makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ReactComponent as RemoveDocument } from "../../../assets/images/circle-delete.svg";
import { ReactComponent as EyeIcon } from "../../../assets/images/eye-icon.svg";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import { FBSection } from "../FBSection";

export const styles = makeStyles(() =>
  createStyles({
    boxWithBorder: {
      borderBottom: `1px solid ${"#B4C0CA"}`,
    },
    boxWithoutBorder: {
      border: "none",
    },
  },
  ));

export interface Props {
  id: string;
  justification: string;
  description: string;
  index: number;
  removeDocument: (index: number) => void;
}

const ProposedDocument: React.FunctionComponent<Props> = ({
  id,
  justification,
  description,
  index,
  removeDocument,
}) => {
  const docRevById = useSelector(documentRevisionsSelectors.byId);
  const proposedDocumentRevision = docRevById[id];
  const [isMouseInside, setMouseInside] = useState<boolean>(false);

  const proposedDocumentRenderer = () => (
    <Box paddingBottom="16px" width="100%">
      <Typography variant="h6">
        <Text message="Proposed document revision" />
      </Typography>
      <TextField
        variant="outlined"
        id="ApprovalRoles-groupName"
        value={`${proposedDocumentRevision.document.docId} - ${proposedDocumentRevision.name}`}
        disabled={true}
        style={{ width: "92%", marginTop: "16px" }}
      />
      <Button
        style={{
          marginLeft: 8,
          marginTop: 17,
          minWidth: 50,
          height: 50,
          background: Colors.medium_blue,
        }}>
        <Link
          target="_blank"
          to={`/document_revision/${proposedDocumentRevision.document.id}/version/${proposedDocumentRevision.id}`}
        >
          <EyeIcon />
        </Link>
      </Button>
    </Box>
  );

  const descriptionOfChangeRender = () => (
    <Box paddingBottom="16px">
      <Typography variant="h6">
        <Text message="Description of change" />
      </Typography>
      <TextField
        variant="outlined"
        id="ApprovalRoles-groupName"
        value={description}
        disabled={true}
        rows={3}
        multiline
        style={{ width: "100%", marginTop: "16px" }}
      />
    </Box>
  );

  const justificationOfChangeRender = () => (
    <Box paddingBottom="16px">
      <Typography variant="h6">
        <Text message="Justification of change" />
      </Typography>
      <TextField
        variant="outlined"
        id="ApprovalRoles-groupName"
        value={justification}
        disabled={true}
        multiline
        rows={3}
        style={{ width: "100%", marginTop: "16px" }}
      />
    </Box>
  );

  return (
    <Box
      pb={4}
      mb={2}
      onMouseEnter={() => setMouseInside(true)}
      onMouseLeave={() => setMouseInside(false)}
    >
      <FBSection label={`Document #${index}`}>
        {isMouseInside && <Box display="flex" flexDirection="row-reverse" mt={-3.5}>
          <Button
            style={{ background: Colors.white, margin: 0, minWidth: 40 }}
            onClick={() => removeDocument(index)}
          >
            <RemoveDocument />
          </Button>
        </Box>}
      </FBSection>
      {proposedDocumentRenderer()}
      {descriptionOfChangeRender()}
      {justificationOfChangeRender()}
    </Box>
  ); };

export default ProposedDocument;
