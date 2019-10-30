import { mount } from "enzyme";
import faker from "faker";
import React from "react";
import getRouteComponentProps from "../../tests/helpers/getRouteComponentProps";
import { ListContainer,  Props } from "./container";
import { ListPresenter } from "./presenter";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: () => ({
    queryDict: { docId: "1" },
    queryData: [],
  }),
}));

jest.mock("../../components/Text");
jest.mock("react-router-dom", () => ({
  Link: (props: any) => props.children,
}));

describe("Change request list container tests", () => {
  const defaultProps: Props = {
      currentUserEmail: faker.internet.email(),
  } as unknown as Props;

  const getWrapper = (props: Partial<Props>= {}) => mount(
    <ListContainer {...defaultProps} {...getRouteComponentProps()} {...props}/>,
  );

  it("render ListPresenter", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ListPresenter)).toHaveLength(1);
  });
});
