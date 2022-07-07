import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionHeaderProps } from "../../../../..";
import FormHeader from "../../../../../../ui/document.revision/header/FormHeader";
import RedlineBanner from "../../../../../../ui/documentRevision/forms/presenters/redline/Redline.banner";
import UpgradeToLatestContainer from "../../../../../../ui/documentRevision/forms/presenters/upgrade.to.latest/UpgradeToLatest.container";
import { withDocumentRevisionHeaderWrap } from "./DocumentRevisionHeader.wrap";

// Prep for switching the form header here
const DocumentRevisionHeader: React.FunctionComponent<DocumentRevisionHeaderProps> = ({
  _documentRevisionFormState,
  bannerPortal,
  documentRevisionId,
  shouldShowUpgrade,
}) =>  (
  <Box bgcolor="red" width="86%">
    <RedlineBanner {...{ bannerPortal }}/>
    <UpgradeToLatestContainer
      type="banner"
      docRevId={documentRevisionId}
      {...{
        bannerPortal,
        shouldShowUpgrade,
      }}
    />
    <Observer>
      {() => (
        <FormHeader
          isCreateDocumentDisabled={_documentRevisionFormState?.createDocumentDisabled || false}
        />
      )}
    </Observer>
  </Box>
);

export default withDocumentRevisionHeaderWrap(DocumentRevisionHeader);
