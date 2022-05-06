import { Box } from "@material-ui/core";
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

      <Box py={1} px={8}>
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

    )}
  </Observer>
);

export default withDocumentRevisionFormHeader(DocumentRevisionFormHeader);
