import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionHeaderProps, SM } from "../../../../..";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../../../../ui/constants/urls";
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
}) => {
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  return (
    <Box maxHeight="30%" minHeight={isCreateUrl ? 64 : 0}>
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
};

export default withDocumentRevisionHeaderWrap(DocumentRevisionHeader);
