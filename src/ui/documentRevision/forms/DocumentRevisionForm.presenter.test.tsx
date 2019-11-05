import { shallow } from "enzyme";
import React from "react";
import { DocumentRevisionFormPresenter, Props } from "./DocumentRevisionForm.presenter";
import { getDocumentRevision, getDocument } from "../../../state/ducks/documentRevisions/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import faker from "faker";
import { getAttachment } from "../../../state/ducks/attachments/tests/factories";
import FormWrapper from "../../components/forms/FormWrapper";
import ScrollToError from "../../components/forms/ScrollToError";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SelectField from "../../components/forms/fields/Select";
import { RevisionStageOptions, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { Link } from "react-router-dom";
import { documentVersionPath } from "../../document.revision/utils/paths";
import RadioButton from "../../components/forms/fields/RadioButton";
import RadioGroupField from "../../components/forms/fields/RadioGroup";

describe("DocumentRevisionFormPresenter tests", () => {
    const defaultProps: Props = {
        asyncState: ASYNC_DEFAULT_STATE,
        showRevisionTypeChange: false,
        availableReferences: [{
            label: faker.lorem.word(),
            value: faker.lorem.word(),
        }],
        loadDocumentProposedId: jest.fn(),
        proposedDocId: faker.random.uuid(),
        documentTypes: [{
            value: faker.lorem.word(),
            text: faker.lorem.word(),
        }],
        documentTypesById: {},
        document: getDocument(),
        uploadTemplate: jest.fn(),
        fbFormMode: jest.fn(),
        classes: {
            container: "",
            reviewButton: "",
        },
        initialValues: {
            description: faker.lorem.words(),
            name: faker.lorem.word(),
            attachments: [getAttachment()],
            document: getDocument(),
            referenceTo: [{
                label: faker.lorem.word(),
                value: faker.lorem.word(),
            }],
        },
        values: {
            description: faker.lorem.words(),
            name: faker.lorem.word(),
            attachments: [getAttachment()],
            document: getDocument(),
            referenceTo: [{
                label: faker.lorem.word(),
                value: faker.lorem.word(),
            }],
        },
    } as unknown as Props;

    const getWrapper = (props: Partial<Props>= {}) => shallow(
        <DocumentRevisionFormPresenter {...defaultProps} {...props}/>,
    );

    it("Displays correctly", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(ScrollToError).exists()).toBe(true);
        expect(wrapper.find(PromptIfDirty).exists()).toBe(true);
        expect(wrapper.find(SelectField)).toHaveLength(2);
        expect(wrapper.find(RadioGroupField).exists()).toBe(false);
    });

    it("Set form props correctly", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(FormWrapper).prop("initialValues")).toEqual(defaultProps.initialValues);
        expect(wrapper.find(FormMessage).prop("asyncState")).toEqual(defaultProps.asyncState);
        expect(wrapper.find(FormProgress).prop("asyncState")).toEqual(defaultProps.asyncState);
    });

    it("Set props correctly", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(SelectField).at(0).prop("options")).toEqual(defaultProps.documentTypes);
        expect(wrapper.find(SelectField).at(1).prop("options")).toEqual(RevisionStageOptions);
        expect(wrapper.find(AutocompleteField).prop("options")).toEqual(defaultProps.availableReferences);
    });

    it("Displays correctly when there is no references", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(Link).exists()).toBe(false);
    });

    it("Displays correctly when there is references", () => {
        const initialValues = {
            description: faker.lorem.words(),
            name: faker.lorem.word(),
            attachments: [getAttachment()],
            referenceTo: [{
                label: faker.lorem.word(),
                value: faker.lorem.word(),
            }],
            document: {...getDocument(), referencedBy: [getDocumentRevision()]},
        };
        const wrapper = getWrapper({...defaultProps, initialValues: initialValues });        
        const reference = initialValues.document.referencedBy[0];

        expect(wrapper.find(Link)).toHaveLength(1);
        expect(wrapper.find(Link).prop("to")).toEqual(documentVersionPath(reference.id, reference.document.id));
    });

    it("Renders type of revision change", () => {
        const wrapper = getWrapper({...defaultProps, showRevisionTypeChange: true });
        const radioButton = wrapper.find(RadioGroupField).find(RadioButton);
        expect(radioButton.at(0).prop("value")).toEqual(RevisionChangeType.NextRevision);
        expect(radioButton.at(1).prop("value")).toEqual(RevisionChangeType.NextRevisionStage);
        expect(radioButton.at(2).prop("value")).toEqual(RevisionChangeType.Obsolete);
    });
});
