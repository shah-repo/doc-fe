import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFooterProps, SMText } from "../../../../..";
import DateFormatter from "../../../../../../ui/components/Date";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import { withDocumentRevisionFooterWrap } from "./DocumentRevisionFooter.wrap";

const DocumentRevisionFooter: React.FunctionComponent<DocumentRevisionFooterProps> = ({
  _documentRevisionFooterState,
}) =>  (
  <Observer>
    {() => (
      <Box
        height={50}
        display={_documentRevisionFooterState?.hidden ? "none" : "flex"}
        justifyContent="center"
        alignItems="center"
        bgcolor={Colors.light_gray}
      >
        <SMText
          boxProps={{ fontWeight: "bold" }}
          label="output.info"
        />:
        <Box px={0.5}>{` ${_documentRevisionFooterState?.docId}, `}</Box>
        <SMText label="common.revision" />
        <Box pr={0.5}>{` ${_documentRevisionFooterState?.version}, `}</Box>
        <DateFormatter value={_documentRevisionFooterState?.releasedAt} />
      </Box>
    )}
  </Observer>
);

// TODO: Remove this in 22.3 as new component created for this
withDocumentRevisionFooterWrap(DocumentRevisionFooter);
