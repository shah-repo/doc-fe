import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import SummaryPresenter from "../document.revision/summary/presenter";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import CloneContainer from "./Clone.container";
import { DocumentRevisionDisplayContainer, DocumentRevisionDisplayContainerProps } from "./DocumentRevisionDisplay.container";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";

jest.mock("react-redux", () => ({
  useSelector: jest.fn((fn) => fn()),
  connect: jest.fn((fn) => fn());,
}));

describe("DocumentRevisionDisplayContainer isNewVersion test", () => {
  const defaultProps: DocumentRevisionDisplayContainerProps = {
    currentUserEmail: faker.internet.email(),
    loadDocumentRevisionAsyncState: ASYNC_DEFAULT_STATE,
    loadDocumentRevision: jest.fn(),
    documentRevisionId: faker.random.uuid(),
    isNewVersion: true,
    documentRevision: getDocumentRevision(),
  };

  const getWrapper = (props: Partial<DocumentRevisionDisplayContainerProps>= {}) => shallow (
    <DocumentRevisionDisplayContainer {...defaultProps} {...props}/>,
  );

  it("Displays Clone container and sets props when it's new version", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(CloneContainer).prop("documentRevision")).toEqual(defaultProps.documentRevision);
    expect(wrapper.find(CloneContainer).exists()).toBe(true);
    expect(wrapper.find(SummaryPresenter).exists()).toBe(false);
    expect(wrapper.find(DocumentRevisionUpdateContainer).exists()).toBe(false);
  });
});

describe("DocumentRevisionDisplayContainer canEdit test", () => {
    const documentRevision = getDocumentRevision();
    const defaultProps: DocumentRevisionDisplayContainerProps = {
        currentUserEmail: documentRevision.owner.user.email,
        loadDocumentRevisionAsyncState: ASYNC_DEFAULT_STATE,
        loadDocumentRevision: jest.fn(),
        documentRevisionId: faker.random.uuid(),
        isNewVersion: false,
      }as unknown as DocumentRevisionDisplayContainerProps;

    const getWrapper = (props: Partial<DocumentRevisionDisplayContainerProps>= {}) => shallow (
      <DocumentRevisionDisplayContainer documentRevision={documentRevision} {...defaultProps} {...props}/>,
    );

    it("Displays DocumentRevisionUpdateContainer and sets props when user canEdit", () => {
      const wrapper = getWrapper();

      expect(wrapper.find(DocumentRevisionUpdateContainer).prop("documentRevision")).toEqual(documentRevision);
      expect(wrapper.find(DocumentRevisionUpdateContainer).exists()).toBe(true);
      expect(wrapper.find(SummaryPresenter).exists()).toBe(false);
      expect(wrapper.find(CloneContainer).exists()).toBe(false);
    });
  });

describe("DocumentRevisionDisplayContainer canPreview test", () => {
const defaultProps: DocumentRevisionDisplayContainerProps = {
    currentUserEmail: faker.internet.email(),
    loadDocumentRevisionAsyncState: ASYNC_DEFAULT_STATE,
    loadDocumentRevision: jest.fn(),
    documentRevisionId: faker.random.uuid(),
    isNewVersion: false,
    documentRevision: getDocumentRevision(),
};

const getWrapper = (props: Partial<DocumentRevisionDisplayContainerProps>= {}) => shallow (
    <DocumentRevisionDisplayContainer {...defaultProps} {...props}/>,
);

it("Displays SummaryPresenter when user canPreview", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(SummaryPresenter).prop("dataProp")).toEqual(defaultProps.documentRevision);
    expect(wrapper.find(SummaryPresenter).exists()).toBe(true);
    expect(wrapper.find(CloneContainer).exists()).toBe(false);
    expect(wrapper.find(DocumentRevisionUpdateContainer).exists()).toBe(false);
});
});
