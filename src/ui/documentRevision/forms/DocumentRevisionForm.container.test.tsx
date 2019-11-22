import { shallow } from "enzyme";
import faker from "faker";
import { Formik } from "formik";
import React from "react";
import { getAttachment } from "../../../state/ducks/attachments/tests/factories";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import { getDocument } from "../../../state/ducks/documents/tests/factories";
import ChangeRequestLink from "../../document.revision/summary/changeRequestLink";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import { DocumentRevisionFormContainer, DocumentRevisionFormContainerProps} from "./DocumentRevisionForm.container";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";

describe("DocumentRevisionFormContainer tests", () => {
    const defaultProps: DocumentRevisionFormContainerProps = {
        onSubmit: jest.fn(),
        initialValues: {
            description: faker.lorem.words(),
            name: faker.lorem.word(),
            attachments: [getAttachment()],
            referenceTo: [{
                label: faker.lorem.word(),
                value: faker.lorem.word(),
            }],
        },
        asyncState: ASYNC_DEFAULT_STATE,
        documentRevision: getDocumentRevision(),
        loadDocumentRevisions: jest.fn(),
        loadDocumentProposedId: jest.fn(),
        uploadTemplate: jest.fn(),
        fbFormMode: jest.fn(),
        availableReferences: [{
            label: faker.lorem.word(),
            value: faker.lorem.word(),
        }],
        loadAsyncState: ASYNC_DEFAULT_STATE,
        documentRevisions: [getDocumentRevision()],
        proposedDocId: faker.random.uuid(),
        documentTypes: [{
            value: faker.lorem.word(),
            text: faker.lorem.word(),
        }],
        documentTypesById: {},
        document: getDocument(),
        showRevisionTypeChange: false,
    };

    const getWrapper = (props: Partial<DocumentRevisionFormContainerProps>= {}) => shallow(
        <DocumentRevisionFormContainer {...defaultProps} {...props}/>,
    );

    it("Sets props correctly", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(ChangeRequestLink).prop("dataProp")).toEqual(defaultProps.documentRevision);
        expect(wrapper.find(Formik).prop("initialValues")).toEqual(defaultProps.initialValues);
    });

    it("Doesn't render ChangeRequestLink if showRevisionTypeChange is true", () => {
        const wrapper = getWrapper({...defaultProps, showRevisionTypeChange: true });
        expect(wrapper.find(ChangeRequestLink).exists()).toBe(false);
        expect(wrapper.find(Formik).exists()).toBe(true);
    });

    it("Renders DocumentRevisionFormPresenter correctly", () => {
        const wrapper = getWrapper();
        const documentRevisionFormPresenter = wrapper.find(Formik).dive().find(DocumentRevisionFormPresenter);
        expect(documentRevisionFormPresenter.exists()).toBe(true);
        expect(documentRevisionFormPresenter.prop("documentRevisions")).toEqual(defaultProps.documentRevisions);
        expect(documentRevisionFormPresenter.prop("availableReferences")).toEqual(defaultProps.availableReferences);
    });
});
