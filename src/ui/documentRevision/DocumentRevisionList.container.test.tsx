import { shallow } from "enzyme";
import React from "react";
import { DocumentRevisionListContainer, DocumentRevisionListContainerProps} from "./DocumentRevisionList.container";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";


describe("DocumentRevisionListContainer component tests", () => {
  const documentRevisions = [
    getDocumentRevision(),
    getDocumentRevision(),
  ]
  const getWrapper = (props: Partial<DocumentRevisionListContainerProps>) => shallow(
    <DocumentRevisionListContainer
      documentRevisions={documentRevisions}
      documentId="123"
      {...props}
    />,
  );

  it("has correct for link first NavLink", () => {
    expect(getWrapper({}).find('NavLink').at(0).prop('to')).toEqual(`/document_revision/123/version/${documentRevisions[0].id}`);
  });

  it("has correct link for second NavLink", () => {
    expect(getWrapper({}).find('NavLink').at(1).prop('to')).toEqual(`/document_revision/123/version/${documentRevisions[0].id}`);
  });

  it("has correct link for third NavLink", () => {
    expect(getWrapper({}).find('NavLink').at(2).prop('to')).toEqual(`/document_revision/123/version/${documentRevisions[1].id}`);
  });

  it("has correct for fourth NavLink", () => {
    expect(getWrapper({}).find('NavLink').at(3).prop('to')).toEqual(`/document_revision/123/version/${documentRevisions[1].id}`);
  });
});
