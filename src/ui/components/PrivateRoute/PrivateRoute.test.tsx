import { mount, ReactWrapper } from "enzyme";
import _ from "lodash";
import React from "react";
import { LOGIN_URL } from "../../constants/urls";
import PrivateRoute, { PrivateRouteProps } from "./PrivateRoute";

jest.mock("react-router-dom", () => ({
  Redirect: () => <div>REDIRECT</div>,
}));

describe("PrivateRoute tests", () => {
  let wrapper: ReactWrapper;

  const TestComponent = () => <div>Test component</div>;
  const defaultProps: PrivateRouteProps = {
    component: TestComponent,
    isAuthenticated: false,
    location: {
      pathname: "target/",
      search: "",
      state: "",
      hash: "",
    },
  };

  const getProps = (customProps: Partial<PrivateRouteProps>): PrivateRouteProps =>
    _.defaultsDeep({}, customProps, defaultProps);

  const getWrapper = (props: PrivateRouteProps) => mount(<PrivateRoute {...props} />);

  describe("when user is authenticated", () => {
    beforeAll(() => {
      wrapper = getWrapper(getProps({ isAuthenticated: true }));
    });

    it("renders TestComponent when user is authenticated", () => {
      expect(wrapper.find(TestComponent).exists()).toBe(true);
    });

    it("does not render Redirect component when user is authenticated", () => {
      expect(wrapper.find("Redirect").exists()).toBe(false);
    });
  });

  describe("when user is not authenticated", () => {
    beforeAll(() => {
      wrapper = getWrapper(getProps({
        isAuthenticated: false,
      }));
    });

    it("renders Redirect component when user is not authenticated", () => {
      expect(wrapper.find("Redirect").exists()).toBe(true);
    });

    it("redirects to login page", () => {
      expect(wrapper.find("Redirect").props().to).toMatchObject({
        pathname: LOGIN_URL,
      });
    });

    it("sends target location to login page", () => {
      expect(wrapper.find("Redirect").props().to).toMatchObject({
        state: {
          from: defaultProps.location,
        },
      });
    });

    it("does not render TestComponent when user is not authenticated", () => {
      expect(wrapper.find(TestComponent).exists()).toBe(false);
    });
  });
});
