import { Chip, Typography } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import { DocumentListInfo, Props } from "./DocumentListInfo";

jest.mock("../../components/Text");

describe("Header tests", () => {
  const defaultProps: Props = {
    documentRevision: getDocumentRevision(),
  };

  const getWrapper = (props: Partial<Props> = {}) => mount(
    <DocumentListInfo {...defaultProps} {...props}/>,
  );

  it("Chip sets prop label correctly", () => {
    const wrapper = getWrapper();
    expect((wrapper.find(Chip).find("Text")).prop("message")).toEqual(defaultProps.documentRevision.status);
  });

  it("docId id displayed", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Typography).contains(defaultProps.documentRevision.document.docId)).toEqual(true);
  });

  it("doc name is displayed", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Typography).contains(defaultProps.documentRevision.name)).toEqual(true);
  });
});
