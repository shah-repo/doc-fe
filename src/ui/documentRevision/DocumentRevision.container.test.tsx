import React from "react";
import { shallow } from "enzyme";
import { DocumentRevisionContainer, DocumentRevisionContainerProps } from "./DocumentRevision.container";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import {
    DOCUMENT_REVISION_DETAILS_URL,
    DOCUMENT_REVISION_VERSION_URL,
  } from "../constants/urls";
import { Route } from "react-router-dom";

describe("DocumentRevisionContainer test", () => {
  const defaultProps: DocumentRevisionContainerProps = {
      ...getRouteComponentProps(),
      documentRevision: getDocumentRevision(),
      loadAsyncState: ASYNC_DEFAULT_STATE,
      load: jest.fn(),
  };

  const getWrapper = (props: Partial<DocumentRevisionContainerProps>= {}) => shallow (
    <DocumentRevisionContainer {...defaultProps} {...props}/>,
  );

  it("Sets props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Route).at(0).prop("path")).toEqual(DOCUMENT_REVISION_VERSION_URL);
    expect(wrapper.find(Route).at(1).prop("path")).toEqual(DOCUMENT_REVISION_DETAILS_URL);
  });
});
