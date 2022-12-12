import { Box, Typography } from "@material-ui/core";
import React from "react";
import { SMText } from "../../../App";
import { styles } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Footer/DocumentRevisionFooter.new.styles";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions/types";
import { generateRevisionNumber } from "../helpers/generateRevisionNumber";

interface Props {
  formDocument?: FBDocumentRevisionProps;
}

const DocumentRevisionOutputInfo: React.FunctionComponent<Props> = ({
  formDocument = {},
}) => {

  const {
    revision,
    subRevision,
    revisionStage,
    revisionChangeType,
    effectiveDate,
  } = formDocument || {};

  const version = generateRevisionNumber(revision, revisionStage as number, subRevision, revisionChangeType);

  const docId = formDocument?.document?.docId;
  const classes = styles();
  return (
    <Box>
      <Typography className={classes.releaseDate}>
        <SMText label="output.info" />
      </Typography>
      <Typography component="div" className={classes.released}>
        <>{docId}</>,&nbsp;
        <SMText label="common.revision" />
        <>{version}</>,&nbsp;
        <>
          {getFormattedDateString( effectiveDate, MomentFormats.MonthDateYearTwoDigit )}
        </>
      </Typography>
    </Box>
  );
};

export default DocumentRevisionOutputInfo;
