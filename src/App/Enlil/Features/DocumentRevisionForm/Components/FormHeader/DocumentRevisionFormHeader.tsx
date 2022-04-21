import { Box, Collapse } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFormHeaderProps } from "../../../../..";
import Title from "../../../../../../ui/document.revision/form/title";
import Description from "../../../../../../ui/documentRevision/forms/presenters/Description";
import { withDocumentRevisionFormHeader } from "./DocumentRevisionFormHeader.wrap";

const DocumentRevisionFormHeader: React.FunctionComponent<DocumentRevisionFormHeaderProps> = ({
  _documentRevisionFormState,
  isDisabledInput,
}) =>  (
  <Observer>
    {() => (
      <Collapse in={!_documentRevisionFormState?.isHeaderHidden}>
        <Box py={_documentRevisionFormState?.documentRevision?.id ? 3.75 : 10} pb={3.75} pl={8} pr={8}>
          <Title
            name="name"
            documentTypeId={_documentRevisionFormState?.documentTypeId}
            disabled={isDisabledInput}
          />
          <Description
            isQms={_documentRevisionFormState?.docInfo.isQms || false}
            documentTypeId={_documentRevisionFormState?.documentTypeId}
            isDisabled={isDisabledInput}
          />
        </Box>
      </Collapse>

    )}
  </Observer>
);

export default withDocumentRevisionFormHeader(DocumentRevisionFormHeader);
