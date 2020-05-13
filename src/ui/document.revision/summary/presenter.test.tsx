import { shallow } from "enzyme";
import { Formik } from "formik";
import React from "react";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import SummaryHeader from "../header/SummaryHeader";
import ChangeRequestLink from "./changeRequestLink";
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
    canShowCreateVersionButton: true,
    canChangeOwnerShip: true,
    dataProp: { ...getDocumentRevision(), status: DocumentRevisionStatus.Released },
    classes: {
      status: "",
      root: "",
      box: "",
      headerContainer: "",
      previewBox: "",
      crId: "",
      trainingText: "",
    },
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <Presenter {...defaultProps} {...props} />,
  ).find(Formik).dive();

  it("Set props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(SummaryHeader).prop("documentRevision")).toEqual(defaultProps.dataProp);
    expect(wrapper.find(ChangeRequestLink).prop("dataProp")).toEqual(defaultProps.dataProp);
    expect(wrapper.find(TrainingControl).prop("dataProp")).toEqual(defaultProps.dataProp.trainingRecords);
  });
});
