import { ExpandLess, ExpandMore, Home } from "@material-ui/icons";
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
    url: "/url",
    text: "header.title",
    Icon: Home,
    childrenUrls: [
      { url: "/child1", text: "header.title", Icon: Home },
      { url: "/child2", text: "header.title" },
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
      url: "/url",
      text: "header.title",
      Icon: Home,
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
      currentPath: defaultProps.childrenUrls && defaultProps.childrenUrls[0].url,
    }));

    expect(wrapper.find(ExpandLess)).toHaveLength(1);
    expect(wrapper.find(NavLink)).toHaveLength(3);
  });

  it("does not render children links when not open", () => {
    const wrapper = getWrapper(getProps({}));

    expect(wrapper.find(NavLink)).toHaveLength(1);
  });

  it("renders children links", () => {
    const wrapper = getWrapper(getProps({}));

    wrapper.find(ExpandMore).simulate("click");

    expect(wrapper.find(NavLink)).toHaveLength(3);
  });
});
