import { shallow } from "enzyme";
import React from "react";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import { DocumentRevisionStatus } from "../../state/ducks/documentRevisions/types";
import { documentVersionPath } from "../document.revision/utils/paths";
import { CloneContainer, CloneContainerProps } from "./Clone.container";
import DocumentRevisionCreateContainer from "./DocumentRevisionCreate.container";

describe("Clone container redirect test", () => {
  const defaultProps: CloneContainerProps = {
    disableCreateNewVersion: true,
    documentRevision: getDocumentRevision(),
    type: "newVersion",
  };

  const getWrapper = (props: Partial<CloneContainerProps> = {}) => shallow(
    <CloneContainer {...defaultProps} {...props}/>,
  );

  it("Redirects when cannot create new version", () => {
    const wrapper = getWrapper();
    const docRev = defaultProps.documentRevision;

    const redirect =  wrapper.find("Redirect").first();
    expect(redirect).toBeDefined();
    expect(redirect.prop("to")).toEqual(documentVersionPath(docRev.id, docRev.document.id));
  });
});

describe("Clone container test", () => {
  const defaultProps: CloneContainerProps = {
    disableCreateNewVersion: false,
    documentRevision: { ...getDocumentRevision(), status: DocumentRevisionStatus.Released },
    type: "newVersion",
  };

  const getWrapper = (props: Partial<CloneContainerProps> = {}) => shallow(
    <CloneContainer {...defaultProps} {...props}/>,
  );

  it("Can create new version", () => {
    const wrapper = getWrapper();

    const documentRevisionCreateContainer = wrapper.find(DocumentRevisionCreateContainer);
    expect(documentRevisionCreateContainer.prop("documentRevision")).toEqual(defaultProps.documentRevision);
  });
});
