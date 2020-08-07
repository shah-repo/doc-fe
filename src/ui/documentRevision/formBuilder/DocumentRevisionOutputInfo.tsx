import { Box } from "@material-ui/core";
import React from "react";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions";
import Date from "../../components/Date";
import Text from "../../components/Text";
import { generateVersionNumber } from "../helpers";

interface Props {
  formDocument?: FBDocumentRevisionProps;
}

const DocumentRevisionOutputInfo: React.FunctionComponent<Props> = ({
  formDocument = {},
}) => {

  const { revision, subRevision, revisionStage, revisionChangeType, releasedAt } = formDocument || {};
  const version = generateVersionNumber(revision, revisionStage, subRevision, revisionChangeType);

  const docId = formDocument?.document?.docId;

  return (
    <Box textAlign="center" mb={8} mt={8}>
      <Box style={{ fontWeight: "bold" }} component="span">
        <Text message="output.info" />:
      </Box>
      <Box component="span" >
        {` ${docId}, `}
        <Text message="common.revision" />
        {` ${version}, `}
        <Date value={releasedAt} />
      </Box>
    </Box>
  );
};

export default DocumentRevisionOutputInfo;
