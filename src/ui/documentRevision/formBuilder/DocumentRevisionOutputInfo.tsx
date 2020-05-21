import { Box, Typography } from "@material-ui/core";
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
    <Box mb={3}>
      <Typography variant="h6">
        <Text message="output.info" />
      </Typography>
      <Box fontSize="subtitle2.fontSize">
        {`${docId}, `}
        <Text message="common.version" />
        {` ${version}, `}
        <Date value={releasedAt} />
      </Box>
    </Box>
  );
};

export default DocumentRevisionOutputInfo;
