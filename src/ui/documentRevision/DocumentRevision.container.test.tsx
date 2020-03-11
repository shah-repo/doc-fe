import { shallow } from "enzyme";
import React from "react";
import { Route } from "react-router-dom";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import {
  DOCUMENT_REVISION_DETAILS_URL,
  DOCUMENT_REVISION_VERSION_URL,
} from "../constants/urls";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import { DocumentRevisionContainer, DocumentRevisionContainerProps } from "./DocumentRevision.container";

describe("DocumentRevisionContainer test", () => {
  const defaultProps: DocumentRevisionContainerProps = {
    ...getRouteComponentProps(),
    documentRevision: getDocumentRevision(),
    loadAsyncState: ASYNC_DEFAULT_STATE,
    load: jest.fn(),
  };

  const getWrapper = (props: Partial<DocumentRevisionContainerProps> = {}) => shallow (
    <DocumentRevisionContainer {...defaultProps} {...props}/>,
  );

  it("Sets props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Route).at(0).prop("path")).toEqual(DOCUMENT_REVISION_VERSION_URL);
    expect(wrapper.find(Route).at(1).prop("path")).toEqual(DOCUMENT_REVISION_DETAILS_URL);
  });
});
