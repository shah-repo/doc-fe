import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFooter, DocumentRevisionSidebar, DocumentRevisionSummaryProps, SMForm, SMTabs, SMTemplate } from "../../..";
import SummaryHeader from "../../../../ui/document.revision/header/SummaryHeader";
import SummaryPresenter from "../../../../ui/document.revision/summary/presenter";
import { checkIsDocumentForm } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBWorkspace } from "../../../../ui/form.builder";
import { withSMTabs } from "../../../Shifamed/Components/SMTabs/SMTabs.hoc";
import { withDocumentRevisionSummaryWrap } from "./DocumentRevisionSummary.wrap";

const DocumentRevisionSummary: React.FunctionComponent<DocumentRevisionSummaryProps> = ({
  onTabChange,
  onScroll,
  _documentRevisionFormState,
  documentRevision,
  canChangeOwnerShip,
  schema,
  isFB,
}) => (
  <SMForm
    values={documentRevision}
    header= {
      <SummaryHeader
        canShowCreateVersionButton={true}
        {...{ documentRevision, canChangeOwnerShip }}
      />
    }
    footer={<DocumentRevisionFooter />}
    {..._documentRevisionFormState?.id && {
      rightSidebar: (
        <Observer>
          {() => (
            <>{_documentRevisionFormState?.documentRevision && <DocumentRevisionSidebar />}</>
          )}
        </Observer>
      ),
    }}
  >
    <SMTemplate>
      <Observer>
        {() => (
          <SMTabs
            onChange={(ev, newValue) => onTabChange?.(ev, newValue)}
            tabs={isFB ? ["sm.overview", "sm.general"] : ["sm.overview"]}
            boxProps={{
              height: "calc(100vh - 70px)",
              overflow: "auto",
              onScroll,
            }}
          >
            <SummaryPresenter
              dataProp={documentRevision}
              canChangeOwnerShip={canChangeOwnerShip}
              canShowCreateVersionButton={true}
            />
            {isFB && (
              <Box mt={5} paddingY={2} paddingX={5} height="calc(100vh - 70px)" overflow="auto">
                <FBWorkspace
                  document={documentRevision}
                  initialValues={documentRevision.formInput}
                  schema={schema}
                  mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions) ?
                    "formPreview" : "preview"}
                />
              </Box>
            )}
          </SMTabs>
        )}
      </Observer>
    </SMTemplate>
  </SMForm>
);

export default withSMTabs(withDocumentRevisionSummaryWrap(DocumentRevisionSummary));
