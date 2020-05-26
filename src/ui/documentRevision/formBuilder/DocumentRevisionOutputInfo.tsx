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

  const { revision, revisionStage, revisionChangeType, releasedAt } = formDocument || {};
  const version = generateVersionNumber(revision, revisionStage, revisionChangeType);

  const docId = formDocument?.document?.docId;

  return (
    <Box textAlign="center">
      <Box style={{ fontWeight: "bold" }} component="span">
        <Text message="output.info" />:
      </Box>
      <Box component="span" >
        {` ${docId}, `}
        <Text message="common.version" />
        {` ${version}, `}
        <Date value={releasedAt} />
      </Box>
    </Box>
  );
};

export default DocumentRevisionOutputInfo;
