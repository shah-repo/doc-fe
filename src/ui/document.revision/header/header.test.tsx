import { Chip, Typography } from "@material-ui/core";
import { mount } from "enzyme";
import faker from "faker";
import React from "react";
import { HeaderInfo, Props } from "../../components/common/header/HeaderInfo";

jest.mock("../../components/Text");

describe("Header Info tests", () => {
  const defaultProps: Props = {
    status: faker.lorem.word(),
    id: faker.lorem.word(),
    name: faker.lorem.word(),
  };

  const getWrapper = (props: Partial<Props> = {}) => mount(
    <HeaderInfo {...defaultProps} {...props}/>,
  );

  it("Chip sets prop label correctly", () => {
    const wrapper = getWrapper();
    expect((wrapper.find(Chip).find("Text")).prop("message")).toEqual(defaultProps.status);
  });

  it("Id is displayed correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Typography).contains(defaultProps.id)).toEqual(true);
  });

  it("Name is displayed correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Typography).contains(defaultProps.name)).toEqual(true);
  });
});
