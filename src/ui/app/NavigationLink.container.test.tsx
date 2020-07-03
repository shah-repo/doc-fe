import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { mount, ReactWrapper } from "enzyme";
import React from "react";
import { NavLink } from "react-router-dom";
import NavigationLinkContainer, { NavigationLinkContainerProps } from "./NavigationLink.container";
import NavigationLinkPresenter from "./NavigationLink.presenter";

jest.mock("../components/Text");
jest.mock("react-router-dom", () => ({
  NavLink: (props: any) => props.children,
}));
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: () => ({
    queryDict: {},
  }),
}));

describe("NavigationLinkContainer component unit tests", () => {
  const defaultProps: NavigationLinkContainerProps = {
    label: "Menu",
    type: "MENU",
    menu: [
      {
        label: "Child 1",
        type: "LINK",
        path: "/child1",
      },
      {
        label: "Child 1",
        type: "LINK",
        path: "/child2",
      },
    ],
    currentPath: "/url",
  };

  const getProps = (props: Partial<NavigationLinkContainerProps>): NavigationLinkContainerProps => ({
    ...defaultProps,
    ...props,
  });

  const getWrapper = (props: NavigationLinkContainerProps): ReactWrapper => mount((
    <NavigationLinkContainer {...props} />
  ));

  it("renders root url with correct props", () => {
    const wrapper = getWrapper(getProps({}));
    const rootUrl = wrapper.find(NavigationLinkPresenter).first();

    expect(rootUrl.props()).toMatchObject({
      label: "Menu",
    });
  });

  it("renders expand more icon when collapse is not open", () => {
    const wrapper = getWrapper(getProps({}));

    expect(wrapper.find(ExpandMore)).toHaveLength(1);
  });

  it("renders expand less icon when collapse is open", () => {
    const wrapper = getWrapper(getProps({}));

    wrapper.find(ExpandMore).simulate("click");

    expect(wrapper.find(ExpandLess)).toHaveLength(1);
  });

  it("renders expand less icon and shows children when child is active", () => {
    const wrapper = getWrapper(getProps({
      currentPath: defaultProps.menu && defaultProps.menu[0].path,
    }));

    expect(wrapper.find(ExpandLess)).toHaveLength(1);
    expect(wrapper.find(NavLink)).toHaveLength(2);
  });

  it("does not render children links when not open", () => {
    const wrapper = getWrapper(getProps({}));

    expect(wrapper.find(NavLink)).toHaveLength(0);
  });

  it("renders children links", () => {
    const wrapper = getWrapper(getProps({}));

    wrapper.find(ExpandMore).simulate("click");

    expect(wrapper.find(NavLink)).toHaveLength(2);
  });
});
