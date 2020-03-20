import { Box, Grid, Typography } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";
import { getChangeRequest } from "../../../state/ducks/changeRequest/tests/factories";
import { Header, Props } from "./header";

jest.mock("../../components/Text");

describe("Header tests", () => {
  const defaultProps: Props = {
    dataProp: getChangeRequest(),
    classes: {
      headerContainer: "",
      status: "",
      crId: "",
    },
  };

  const getWrapper = (props: Partial<>) => mount(
    <Header {...defaultProps} {...props}/>,
  ).find(Grid);

  it("Status is displayed correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(Box).contains(defaultProps.dataProp.state));
    expect(wrapper.find(Box).contains(defaultProps.dataProp.closedAt));
  });

  it("Title and crId are displayed correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(Typography).contains(defaultProps.dataProp.title));
    expect(wrapper.find(Typography).contains(defaultProps.dataProp.crId));
  });
});
