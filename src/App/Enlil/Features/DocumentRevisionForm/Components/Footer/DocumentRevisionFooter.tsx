import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFooterProps, FormFooter, SMText } from "../../../../..";
import DateFormatter from "../../../../../../ui/components/Date";
import { withDocumentRevisionFooterWrap } from "./DocumentRevisionFooter.wrap";


const DocumentRevisionFooter: React.FunctionComponent<DocumentRevisionFooterProps> = ({
  _documentRevisionFooterState,
}) =>  (
  <FormFooter>
    <Observer>
      {() => (
        <>
          <SMText
            boxProps={{ fontWeight: "bold" }}
            label="output.info"
          />:
          <Box px={0.5}>{` ${_documentRevisionFooterState?.docId}, `}</Box>
          <SMText label="common.revision" />
          <Box pr={0.5}>{` ${_documentRevisionFooterState?.version}, `}</Box>
          <DateFormatter value={_documentRevisionFooterState?.releasedAt} />
        </>
      )}
    </Observer>
  </FormFooter>
);

export default withDocumentRevisionFooterWrap(DocumentRevisionFooter);
