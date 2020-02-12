import { Box } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Date from "../../components/Date";
import Text from "../../components/Text";
import { generateVersionNumber } from "../helpers";

const DocumentRevisionOutputInfo: React.FunctionComponent<DataProps<DocumentRevision>> = ({
  dataProp,
}) => {

  const { revision, revisionStage, revisionChangeType, releasedAt } = _.get(dataProp, "formDocument") || {};
  const hasVersion = revision && revisionStage;
  const version = hasVersion
    ? generateVersionNumber(revision!, revisionStage!, revisionChangeType!)
    : "";

  const docId = _.get(dataProp, "formDocument.document.docId");

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
