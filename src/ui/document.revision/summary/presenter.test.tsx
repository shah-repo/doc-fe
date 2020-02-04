import { shallow } from "enzyme";
import { Formik } from "formik";
import React from "react";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import ChangeRequestLink from "./changeRequestLink";
import DocumentHeader from "./header";
import { Presenter, Props } from "./presenter";
import TrainingControl from "./training.control";

jest.mock("react-redux", () => ({
    useSelector: () => ({
        documentTypesById: [],
    }),
    connect: (mapStateToProps: any, mapDispatchToProps: any) => (ReactComponent: any) => ({
        mapStateToProps,
        mapDispatchToProps,
        ReactComponent,
      }),
  }));

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
