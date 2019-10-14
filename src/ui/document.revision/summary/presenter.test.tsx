import { shallow } from "enzyme";
import React from "react";
import { Presenter, Props } from "./presenter";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import { Formik } from "formik";
import ChangeRequestLink from "./changeRequestLink";
import DocumentHeader from "./header";
import TrainingControl from "./training.control";

describe("Presenter tests", () => {
    const defaultProps: Props = {
        dataProp: { ...getDocumentRevision(), status: "RELEASED" },
        classes: {
            previewBox: "",
            submitBox: "",
        },
    };

    const getWrapper = (props: Partial<Props>= {}) => shallow(
    <Presenter {...defaultProps} {...props} />,
    ).find(Formik).dive();

    it("Set props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(DocumentHeader).prop("dataProp")).toEqual(defaultProps.dataProp);
    expect(wrapper.find(ChangeRequestLink).prop("dataProp")).toEqual(defaultProps.dataProp);
    expect(wrapper.find(TrainingControl).prop("dataProp")).toEqual(defaultProps.dataProp.trainingRecords);
    });
});
