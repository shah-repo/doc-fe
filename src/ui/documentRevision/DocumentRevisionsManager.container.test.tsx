import faker from "faker";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import React from "react";
import { Redirect } from "react-router-dom";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import { shallow } from "enzyme";
import DocumentRevisionAuditContainer from "./audit/Audit.container";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import {
    DocumentRevisionManagerContainer,
    DocumentRevisionManagerContainerProps,
} from "./DocumentRevisionsManager.container";

describe("DocumentRevisionManagerContainer with documentRevisionId test", () => {
    const defaultProps: DocumentRevisionManagerContainerProps = {
        loadDocumentAsyncState: ASYNC_DEFAULT_STATE,
        documentRevisions: [getDocumentRevision()],
        loadDocument: jest.fn(),
        documentId: faker.random.uuid(),
        documentRevisionId: faker.random.uuid(),
        isNewVersion: false,
        deprecatedAt: "01-01-21019",
        classes: {
            whiteContainer: "",
            sidebar: "",
        },
    };

    const getWrapper = (props: Partial<DocumentRevisionManagerContainerProps>= {}) => shallow (
        <DocumentRevisionManagerContainer {...defaultProps} {...props}/>,
    );

    it("Sets DocumentRevisionListContainer props correctly", () => {
        const wrapper = getWrapper();
        const documentRevisionListContainer = wrapper.find(DocumentRevisionListContainer);

        expect(documentRevisionListContainer.prop("documentRevisions")).toEqual(defaultProps.documentRevisions);
        expect(documentRevisionListContainer.prop("documentId")).toEqual(defaultProps.documentId);
    });

    it("Sets DocumentRevisionDisplayContainer props correctly", () => {
        const wrapper = getWrapper();
        const documentRevisionDisplayContainer = wrapper.find(DocumentRevisionDisplayContainer);

        expect(documentRevisionDisplayContainer.prop("documentRevisionId")).toEqual(defaultProps.documentRevisionId);
        expect(documentRevisionDisplayContainer.prop("isNewVersion")).toEqual(defaultProps.isNewVersion);
    });

    it("Sets DocumentRevisionAuditContainer props correctly", () => {
        const wrapper = getWrapper();
        const documentRevisionAuditContainer = wrapper.find(DocumentRevisionAuditContainer);

        expect(documentRevisionAuditContainer.prop("documentRevisionId")).toEqual(defaultProps.documentRevisionId);
    });
});

describe("DocumentRevisionManagerContainer with documentRevisionId test", () => {
    const defaultProps: DocumentRevisionManagerContainerProps = {
        loadDocumentAsyncState: ASYNC_DEFAULT_STATE,
        documentRevisions: [getDocumentRevision()],
        loadDocument: jest.fn(),
        documentId: faker.random.uuid(),
        documentRevisionId: null,
        isNewVersion: false,
        deprecatedAt: "01-01-21019",
        classes: {
            whiteContainer: "",
            sidebar: "",
        },
    };

    const getWrapper = (props: Partial<DocumentRevisionManagerContainerProps>= {}) => shallow (
        <DocumentRevisionManagerContainer {...defaultProps} {...props}/>,
    );

    it("Displays correctly", () => {
        const wrapper = getWrapper();

        expect(wrapper.find(Redirect)).toHaveLength(1);
        expect(wrapper.find(DocumentRevisionDisplayContainer)).toHaveLength(0);
        expect(wrapper.find(DocumentRevisionAuditContainer)).toHaveLength(0);
        });
});
