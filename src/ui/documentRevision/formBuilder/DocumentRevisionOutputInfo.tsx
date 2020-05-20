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
    <Box mb={3}>
      <Box mb={0.5} fontSize="h6.fontSize" fontWeight={300}>
        <Text message="output.info" />
      </Box>
      <Box display="row" fontSize="subtitle2.fontSize">
        {`${docId}, `}
        <Text message="common.version" />
        {` ${version}, `}
        <Date value={releasedAt} />
      </Box>
    </Box>
  );
};

export default DocumentRevisionOutputInfo;
