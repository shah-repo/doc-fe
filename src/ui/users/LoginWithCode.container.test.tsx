/* eslint-disable @typescript-eslint/unbound-method */
import { mount } from "enzyme";
import { defaultsDeep } from "lodash";
import React from "react";
import { act } from "react-dom/test-utils";
import { LoginWithCodeRequestBody } from "../../state/ducks/auth/types";
import { Handlers } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import { LOGIN_URL } from "../constants/urls";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import { LoginWithCodeContainer, LoginWithCodeContainerProps } from "./LoginWithCode.container";

describe("LoginWithCodeContainer unit tests", () => {
  const defaultProps: LoginWithCodeContainerProps = {
    ...getRouteComponentProps(),
    location: {
      ...getRouteComponentProps().location,
      search: "?code=123",
    },
    loginWithCode: jest.fn(),
  };

  const getProps = (customProps: Partial<LoginWithCodeContainerProps>): LoginWithCodeContainerProps =>
    defaultsDeep({}, customProps, defaultProps);

  const getWrapper = (props: LoginWithCodeContainerProps) => mount(<LoginWithCodeContainer {...props} />);

  it("redirects to LOGIN_URL when code is not set", () => {
    const props = getProps({
      location: {
        ...defaultProps.location,
        search: "",
      },
    });

    act(() => {
      getWrapper(props);
    });

    expect(props.history.replace).toHaveBeenCalledWith(LOGIN_URL);
  });

  it("calls loginWithCode", () => {
    const props = getProps({});

    act(() => {
      getWrapper(props);
    });

    const loginWithCodeParams: LoginWithCodeRequestBody = { code: "123" };
    expect(props.loginWithCode).toHaveBeenCalledWith(loginWithCodeParams, expect.anything());
  });

  it("renders AsyncGate", () => {
    expect(getWrapper(getProps({})).find(AsyncGate)).toHaveLength(1);
  });

  it("redirects to HOME_URL on success", () => {
    const loginWithCode = jest.fn().mockImplementation((p: any, async: Handlers) => async.successHandler.execute(null));
    const props = getProps({ loginWithCode });

    act(() => {
      getWrapper(props);
    });

    expect(props.history.replace).toHaveBeenCalledWith(LOGIN_URL);
  });

  it("redirects to LOGIN_URL on error", () => {
    const loginWithCode = jest.fn().mockImplementation((p: any, async: Handlers) => async.errorHandler.execute("ERR"));
    const props = getProps({ loginWithCode });

    act(() => {
      getWrapper(props);
    });

    expect(props.history.replace).toHaveBeenCalledWith(LOGIN_URL);
  });
});
