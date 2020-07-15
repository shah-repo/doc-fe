import { Box, Button, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { ReactComponent as RemoveDocument } from "../../../../assets/images/circle-delete.svg";
import { ReactComponent as EyeIcon } from "../../../../assets/images/eye-icon.svg";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
import { FBSection } from "../../FBSection";
import { FBProposedDocumentProps } from "../FBDocumentRevisions.types";
import { withFBProposedDocument } from "./FBProposedDocument.wrap";

const FBProposedDocument: React.FunctionComponent<FBProposedDocumentProps> = ({
  justification,
  description,
  index,
  removeDocument,
  proposedDocumentRevision,
  setMouseInside,
  isMouseInside,
  disabled,
}) => {
  const intl = useIntl();

  const proposedDocumentRenderer = () => (
    <Box pb={2} width="100%">
      <Typography variant="h6">
        <Text translation="form.builder.proposed.document.revision" />
      </Typography>
      <TextField
        variant="outlined"
        id="ProposedDocument-docRev"
        value={`${proposedDocumentRevision?.document.docId} - ${proposedDocumentRevision?.name}`}
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
          to={`/document_revision/${proposedDocumentRevision?.document.id}/version/${proposedDocumentRevision?.id}`}
        >
          <EyeIcon />
        </Link>
      </Button>
    </Box>
  );

  const descriptionOfChangeRender = () => (
    <Box pb={2} >
      <Typography variant="h6">
        <Text translation="common.description" />
      </Typography>
      <TextField
        variant="outlined"
        id="ProposedDocument-description"
        value={description}
        disabled={true}
        rows={3}
        multiline
        style={{ width: "100%", marginTop: "16px" }}
      />
    </Box>
  );

  const justificationOfChangeRender = () => (
    <Box pb={2} >
      <Typography variant="h6">
        <Text translation="cr.justification" />
      </Typography>
      <TextField
        variant="outlined"
        id="ProposedDocument-justification"
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
      data-cy = "addedDocuments"
    >
      <FBSection label={`${intl.formatMessage({
        id: "common.document",
      })} #${index}`}>
        {isMouseInside && !disabled && <Box display="flex" flexDirection="row-reverse" mt={-3.5}>
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

export default withFBProposedDocument(FBProposedDocument);
