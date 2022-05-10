import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFormHeaderProps } from "../../../../..";
import Title from "../../../../../../ui/document.revision/form/title";
import ChangeRequestLink from "../../../../../../ui/document.revision/summary/changeRequestLink";
import Description from "../../../../../../ui/documentRevision/forms/presenters/Description";
import { withDocumentRevisionFormHeader } from "./DocumentRevisionFormHeader.wrap";

const DocumentRevisionFormHeader: React.FunctionComponent<DocumentRevisionFormHeaderProps> = ({
  _documentRevisionFormState,
  isDisabledInput,
  type,
}) =>  (
  <Observer>
    {() => (

      <Box py={1} px={8}>
        {
          type !== "newOutput" && _documentRevisionFormState?.documentRevision &&
            <ChangeRequestLink dataProp={_documentRevisionFormState?.documentRevision} />
        }
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
