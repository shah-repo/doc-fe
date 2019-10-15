import React from "react";
import { shallow } from "enzyme";
import { DocumentRevisionContainer, DocumentRevisionContainerProps } from "./DocumentRevisionTable.container";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import faker from "faker";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import DocumentRevisionTable from './DocumentRevisionTable.presenter';

describe("DocumentRevisionContainer test", () => {
  const defaultProps: DocumentRevisionContainerProps = {
    ...getRouteComponentProps(),
     loadAsyncState: ASYNC_DEFAULT_STATE,
     documentRevisions: [getDocumentRevision()],
     currentUserEmail: faker.internet.email(),
    loadDocumentRevisions: jest.fn(),
  };

  const getWrapper = (props: Partial<DocumentRevisionContainerProps>= {}) => shallow (
    <DocumentRevisionContainer {...defaultProps} {...props}/>,
  );

  it("Sets props correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(DocumentRevisionTable).prop("documentRevisions")).toEqual(defaultProps.documentRevisions);
    expect(wrapper.find(DocumentRevisionTable).prop("currentUserEmail")).toEqual(defaultProps.currentUserEmail);
 });
});
