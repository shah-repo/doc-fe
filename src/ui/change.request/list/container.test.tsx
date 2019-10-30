import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import getRouteComponentProps from "../../tests/helpers/getRouteComponentProps";
import { ListContainer,  Props } from "./container";
import { ListPresenter } from "./presenter";

jest.mock("react-redux");

describe("Change request list container tests", () => {
  const defaultProps: Props = {
      currentUserEmail: faker.internet.email(),
  } as unknown as Props;

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ListContainer {...defaultProps} {...getRouteComponentProps()} {...props}/>,
  );

  it("render ListPresenter", () => {
    const wrapper = getWrapper();
    expect(wrapper.dive().find(ListPresenter)).toHaveLength(1);
  });
});
