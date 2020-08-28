import { mount, ReactWrapper } from "enzyme";
import { defaultsDeep } from "lodash";
import React from "react";
import { getEmployee } from "../../state/ducks/company/tests/factories";
import { HOME_URL } from "../constants/urls";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import { LoginContainer, LoginContainerProps } from "./Login.container";

jest.mock("react-router-dom", () => ({
  // eslint-disable-next-line react/display-name
  Redirect: () => <div>REDIRECT</div>,
}));

jest.mock("./Login.presenter", () => () => <div>LOGIN PRESENTER</div>);

describe("LoginContainer unit tests", () => {
  let wrapper: ReactWrapper;

  const defaultProps: LoginContainerProps = {
    isUserAuthenticated: false,
    location: {
      ...getRouteComponentProps().location,
    },
    hasMultipleCompanies: false,
    employees: [getEmployee()],
  };

  const getProps = (
    customProps: Partial<LoginContainerProps>,
  ): LoginContainerProps => defaultsDeep({}, customProps, defaultProps);

  const getWrapper = (props: LoginContainerProps) =>
    mount(<LoginContainer {...props} />);

  describe("when user is not authenticated", () => {
    beforeAll(() => {
      wrapper = getWrapper(getProps({ isUserAuthenticated: false }));
    });

    it("renders LoginPresenter", () => {
      expect(wrapper.text()).toEqual("LOGIN PRESENTER");
    });

    it("does not render Redirect component", () => {
      expect(wrapper.find("Redirect").exists()).toBe(false);
    });
  });

  describe("when user is authenticated", () => {
    beforeAll(() => {
      wrapper = getWrapper(getProps({ isUserAuthenticated: true }));
    });

    it("does not render LoginPresenter component", () => {
      expect(wrapper.text()).not.toEqual("LOGIN PRESENTER");
    });

    it("redirects to `HOME_URL` page", () => {
      expect(wrapper.find("Redirect").props().to).toMatchObject({
        pathname: HOME_URL,
      });
    });

    it("redirects to `state` from location", () => {
      const from = { control: true };
      wrapper.setProps({
        location: {
          ...defaultProps.location,
          state: { from },
        },
      });
      wrapper.update();

      expect(wrapper.find("Redirect").props().to).toMatchObject(from);
    });
  });
});
