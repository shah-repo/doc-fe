import { Box, Typography } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFooterProps, SMText } from "../../../../..";
import { getFormattedDateString, MomentFormats } from "../../../../../../common/utils/date";
import { styles } from "./DocumentRevisionFooter.new.styles";
import { withDocumentRevisionFooterWrap } from "./DocumentRevisionFooter.wrap";

const DocumentRevisionFooterNew: React.FunctionComponent<DocumentRevisionFooterProps> = ({
  _documentRevisionFooterState,
}) => {
  const classes = styles();
  return (
    <Observer>
      {() => (
        <Box
          pt={2.5}
          display={_documentRevisionFooterState?.hidden ? "none" : "block"}
        >
          <Typography className={classes.releaseDate}>
            <SMText label="output.info" />
          </Typography>
          <Typography component="div" className={classes.released}>
            <>{_documentRevisionFooterState?.docId}</>,&nbsp;
            <SMText label="common.revision" />
            <>{_documentRevisionFooterState?.version}</>,&nbsp;
            <>
              {getFormattedDateString(
                  _documentRevisionFooterState?.releasedAt,
                  MomentFormats.MonthDateYearTwoDigit
              )}
            </>
          </Typography>
        </Box>
      )}
    </Observer>
  );
};

export default withDocumentRevisionFooterWrap(DocumentRevisionFooterNew);
