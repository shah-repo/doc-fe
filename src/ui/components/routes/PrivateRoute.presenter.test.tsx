import { mount, ReactWrapper } from "enzyme";
// eslint-disable-next-line: no-implicit-dependencies
import { History } from "history";
import { defaultsDeep } from "lodash";
import React from "react";
import { LOGIN_URL } from "../../constants/urls";
import PrivateRoutePresenter, { PrivateRoutePresenterProps } from "./PrivateRoute.presenter";

jest.mock("react-router-dom", () => ({
  // eslint-disable-next-line react/display-name
  Redirect: () => <div>REDIRECT</div>,
}));

describe("PrivateRoute tests", () => {
  let wrapper: ReactWrapper;

  const TestComponent = () => <div>Test component</div>;
  const defaultProps: PrivateRoutePresenterProps = {
    component: TestComponent,
    isAuthenticated: false,
    location: {
      pathname: "target/",
      search: "",
      state: "",
      hash: "",
    },
    history: {
      replace: jest.fn(),
    } as unknown as History,
  };

  const getProps = (customProps: Partial<PrivateRoutePresenterProps>): PrivateRoutePresenterProps =>
    defaultsDeep({}, customProps, defaultProps);

  const getWrapper = (props: PrivateRoutePresenterProps) => mount(<PrivateRoutePresenter {...props} />);

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
