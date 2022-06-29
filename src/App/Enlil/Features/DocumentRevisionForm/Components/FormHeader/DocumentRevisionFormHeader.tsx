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
      <Box
        id="SMHeaderTmpl"
        paddingTop={_documentRevisionFormState?.documentRevision?.id ? 0.75 : 9.125}
        paddingBottom={2.5}
        pl={2.75}
        pr={4.25}
      >
        {
          type !== "newOutput" && _documentRevisionFormState?.documentRevision &&
            <ChangeRequestLink dataProp={_documentRevisionFormState?.documentRevision} />
        }
        <Box paddingBottom={1.25}>
          <Title
            name="name"
            documentTypeId={_documentRevisionFormState?.documentTypeId}
            disabled={isDisabledInput}
          />
        </Box>
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
