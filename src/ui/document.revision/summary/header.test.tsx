import { Chip, Typography } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import { Header,  Props } from "./header";

jest.mock("../../components/Text");

describe("Header tests", () => {
  const defaultProps: Props = {
    dataProp: getDocumentRevision(),
    classes: {
      headerContainer: "",
      status: "",
      crId: "",
    },
  };

  const getWrapper = (props: Partial<Props> = {}) => mount(
    <Header {...defaultProps} {...props}/>,
  );

  it("Chip sets prop label correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Chip).prop("label")).toEqual(defaultProps.dataProp.status);
  });

  it("docId id displayed", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Typography).contains(defaultProps.dataProp.document.docId)).toEqual(true);
  });
});
