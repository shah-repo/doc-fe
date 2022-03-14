import { Box, makeStyles, Typography } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFooterProps, SMText } from "../../../../..";
import { getFormattedDateString, MomentFormats } from "../../../../../../common/utils/date";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import { withDocumentRevisionFooterWrap } from "./DocumentRevisionFooter.wrap";

const footerClasses = makeStyles(() => ({
  released: {
    fontFamily: "Sora",
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "20px",
    color: Colors.almost_black,
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
  },
  releaseDate: {
    fontFamily: "Sora",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "15px",
    color: Colors.almost_black,
  },
}));

const DocumentRevisionFooter: React.FunctionComponent<DocumentRevisionFooterProps> = ({
  _documentRevisionFooterState,
}) => {
  const classes = footerClasses();
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
            <Box>{` ${_documentRevisionFooterState?.docId}`}</Box>,&nbsp;
            <SMText label="common.revision" />
            <Box>{` ${_documentRevisionFooterState?.version}`}</Box>,&nbsp;
            <Box>{getFormattedDateString(_documentRevisionFooterState?.releasedAt, MomentFormats.YearMonthDateDotNotation)}</Box>
          </Typography>
        </Box>
      )}
    </Observer>
  );
};

export default withDocumentRevisionFooterWrap(DocumentRevisionFooter);
