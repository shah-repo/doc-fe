import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { Link } from "react-router-dom";
import { getAttachment } from "../../../state/ducks/attachments/tests/factories";
import { RevisionStageOptions } from "../../../state/ducks/documentRevisions";
import { getDocument } from "../../../state/ducks/documentRevisions/tests/factories";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import RadioGroupField from "../../components/forms/fields/RadioGroup";
import SelectField from "../../components/forms/fields/Select";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import { DocumentRevisionFormPresenter, Props } from "./DocumentRevisionForm.presenter";

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
});
