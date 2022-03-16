import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionSidebar, DocumentRevisionSummaryHeader, DocumentRevisionSummaryProps, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import SummaryHeader from "../../../../ui/document.revision/header/SummaryHeader";
import SummaryPresenter from "../../../../ui/document.revision/summary/presenter";
import { checkIsDocumentForm } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBWorkspace } from "../../../../ui/form.builder";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMForm } from "../../../Shifamed/Components/SMForm/SMForm.hoc";
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
    templateBoxProps={{ stretchY: "100%" }}
    headerBoxProps={{ maxHeight: "30%" }}
    contentBoxProps={{ minHeight: "calc(100% - 30%)", height: "100%" }}
    values={documentRevision}
    header= {
      <SummaryHeader
        canShowCreateVersionButton={true}
        {...{ documentRevision, canChangeOwnerShip }}
      />
    }
  >
    <SMTemplate
      templateBoxProps={{ stretchY: "100%", borderTop: 1, borderColor: Colors.medium_gray }}
      contentBoxProps={{ stretchY: "100%" }}
      rightSidebarBoxProps={{ zIndex: 2 }}
      {..._documentRevisionFormState?.documentRevision && {
        rightSidebar: (
          <Observer>
            {() => <DocumentRevisionSidebar edit={false} />}
          </Observer>
        ),
      }}
    >
      <SMTemplate
        templateBoxProps={{ stretchY: "100%" }}
        headerBoxProps={{ maxHeight: "80%" }}
        contentBoxProps={{ minHeight: "20%", height: "100%" }}
        header={<DocumentRevisionSummaryHeader {...{ documentRevision }} />}
      >
        <Observer>
          {() => (
            <SMTabs
              onChange={(ev, newValue) => onTabChange?.(ev, newValue)}
              tabs={isFB ? ["sm.overview", "sm.general"] : ["sm.overview"]}
              boxProps={{ stretchY: "100%" }}
            >
              <SMBox stretchY="100%" overflow={"auto"} {...{ onScroll }}>
                <SMBox mt={8} px={6} stretchY="100%">
                  <SummaryPresenter
                    dataProp={documentRevision}
                    canChangeOwnerShip={canChangeOwnerShip}
                    canShowCreateVersionButton={true}
                  />
                </SMBox>
              </SMBox>
              {isFB && (
                <SMBox height="100%" overflow={"auto"} {...{ onScroll }}>
                  <SMBox mt={8} px={6} stretchY="100%">
                    <FBWorkspace
                      document={documentRevision}
                      initialValues={documentRevision.formInput}
                      schema={schema}
                      mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions) ?
                        "formPreview" : "preview"}
                    />
                  </SMBox>
                </SMBox>
              )}
            </SMTabs>
          )}
        </Observer>
      </SMTemplate>
    </SMTemplate>
  </SMForm>
);

export default withSMForm(withSMTabs(withDocumentRevisionSummaryWrap(DocumentRevisionSummary)));
