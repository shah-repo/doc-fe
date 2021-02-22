import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { AuthResponse, AuthUserAction, AUTH_AWS_IOT_URL, AUTH_USER, ClearNonAuthDataAction, CLEAR_NON_AUTH_DATA, ConfirmPasswordAction, CONFIRM_FORGOT_PASSWORD_URL, CONFIRM_SET_NEW_PASSWORD_URL, EditUserMeAction, EmployeeEditRequestBody, ForgotPassword, ForgotPasswordAction, ForgotPasswordConfirmation, FORGOT_PASSWORD_URL, Group, GROUPS_URL, LoginRequestBody, LoginWithCodeRequestBody, LOGIN_URL, LOGIN_WITH_CODE_URL, LogoutRequestBody, LogoutUserAction, LOGOUT_URL, LOGOUT_USER, NewPasswordConfirmation, NewUserSetPasswordAction, PING_SERVER_GET_ASYNC, PING_SERVER_URL, RESEND_SIGNUP_EMAIL_URL, SelectEmployeeAction, SESSION_DETAILS_URL, SetCredentialsAction, SET_CREDENTIALS, SET_EMPLOYEE, SignupAction, SIGNUP_URL, ToggleCustomLabelsAction, TOGGLE_CUSTOM_LABELS, User, UserGroupsAction, USERS_ME_URL, USERS_URL, USER_GROUPS, USER_GROUPS_GET_ASYNC } from ".";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApplicationState } from "../../reducers";
import { ApiAction, Handlers } from "../../types";
import { companyActions, Employee } from "../company";
import { userManagementActions } from "../userManagement";

const authSignup = (): SignupAction => ({
  type: SIGNUP_URL,
});

const authForgotPassword = (): ForgotPasswordAction => ({
  type: FORGOT_PASSWORD_URL,
});

const authConfirmPassword = (): ConfirmPasswordAction => ({
  type: CONFIRM_FORGOT_PASSWORD_URL,
});

const authNewUserSetPassword = (): NewUserSetPasswordAction => ({
  type: CONFIRM_SET_NEW_PASSWORD_URL,
});

const authUser = (data: AuthResponse): AuthUserAction => ({
  type: AUTH_USER,
  payload: data,
});

const logoutUser = (): LogoutUserAction => ({
  type: LOGOUT_USER,
});

const userGroups = (groups: Group[]): UserGroupsAction => ({
  type: USER_GROUPS,
  payload: groups,
});

const editUser = (user: User): EditUserMeAction => ({
  type: USERS_ME_URL,
  payload: user,
});

const setCredentials = (iotCredentials: any): SetCredentialsAction => ({
  type: SET_CREDENTIALS,
  payload: iotCredentials,
});

const toggleCustomLabels = (customLabel: boolean): ToggleCustomLabelsAction => ({
  type: TOGGLE_CUSTOM_LABELS,
  payload: customLabel,
});

const editCurrentEmployee = (
  body: EmployeeEditRequestBody,
  handlers: Handlers,
): ApiAction<Partial<AuthResponse>> =>
  apiActionWithCallbacks({
    url: `${USERS_ME_URL}`,
    method: "patch",
    data: body,
    onSuccess: (user, dispatch) => {
      dispatch(editUser(user));
    },
    handlers,
  });

const editSelectedEmployee = (
  id: string,
  body: EmployeeEditRequestBody,
  handlers: Handlers,
): ApiAction<Partial<AuthResponse>> =>
  apiActionWithCallbacks({
    url: `${USERS_URL}/${id}`,
    method: "patch",
    data: body,
    onSuccess: (user, dispatch) => {
      dispatch(userManagementActions.editSelectedEmployeeUserInfo(user));
    },
    handlers,
  });

const login = (
  loginValues: LoginRequestBody,
  handlers: Handlers,
): ApiAction<AuthResponse, LoginRequestBody> =>
  apiActionWithCallbacks({
    url: LOGIN_URL,
    method: "post",
    data: loginValues,
    includeAuthorization: false,
    onSuccess: (data: AuthResponse, dispatch) => {
      dispatch(authUser(data));

      if ((data.employees || []).length === 1) {
        dispatch(companyActions.selectCompany(data.employees[0].company));
        dispatch(getIotCreds());
      }
    },
    handlers,
  });

const signup = (
  loginValues: LoginRequestBody,
  handlers: Handlers,
): ApiAction<AuthResponse, LoginRequestBody> =>
  apiActionWithCallbacks({
    url: SIGNUP_URL,
    method: "post",
    data: loginValues,
    includeAuthorization: false,
    onSuccess: (m, dispatch) => {
      dispatch(authSignup());
    },
    handlers,
  });

const forgotPassword = (
  values: ForgotPassword,
  handlers: Handlers,
): ApiAction<AuthResponse, ForgotPassword> =>
  apiActionWithCallbacks({
    url: FORGOT_PASSWORD_URL,
    method: "post",
    data: values,
    includeAuthorization: false,
    onSuccess: (m, dispatch) => {
      dispatch(authForgotPassword());
    },
    handlers,
  });

const confirmNewPassword = (
  confirmValues: ForgotPasswordConfirmation,
  handlers: Handlers,
): ApiAction<AuthResponse, ForgotPasswordConfirmation> =>
  apiActionWithCallbacks({
    url: CONFIRM_FORGOT_PASSWORD_URL,
    method: "post",
    data: confirmValues,
    includeAuthorization: false,
    onSuccess: (m, dispatch) => {
      dispatch(authConfirmPassword());
      dispatch(
        login(
          { email: confirmValues.email, password: confirmValues.password },
          handlers,
        ),
      );
    },
    handlers,
  });

const newUserSetPassword = (
  confirmValues: NewPasswordConfirmation,
  handlers: Handlers,
): ApiAction<AuthResponse, NewPasswordConfirmation> =>
  apiActionWithCallbacks({
    url: CONFIRM_SET_NEW_PASSWORD_URL,
    method: "post",
    data: confirmValues,
    includeAuthorization: false,
    onSuccess: (m, dispatch) => {
      dispatch(authNewUserSetPassword());
      dispatch(
        login(
          { email: confirmValues.email, password: confirmValues.newPassword },
          handlers,
        ),
      );
    },
    handlers,
  });

const loginWithCode = (
  loginValues: LoginWithCodeRequestBody,
  handlers: Handlers,
): ApiAction<AuthResponse, LoginWithCodeRequestBody> =>
  apiActionWithCallbacks({
    url: LOGIN_WITH_CODE_URL,
    method: "post",
    data: loginValues,
    includeAuthorization: false,
    onSuccess: (response, dispatch) => {
      dispatch(authUser(response));
    },
    onFailure: (m, dispatch) => {
      dispatch(logoutUser());
    },
    handlers,
  });

const resendSignupEmail = (
  email: string,
  handlers: Handlers,
): ApiAction<Partial<AuthResponse>> =>
  apiActionWithCallbacks({
    url: RESEND_SIGNUP_EMAIL_URL,
    method: "post",
    data: { email },
    handlers,
  });

const logout = (): ThunkAction<void, ApplicationState, any, AnyAction> => (
  dispatch,
  getState,
) => {
  const action: ApiAction<any, LogoutRequestBody> = apiAction({
    url: LOGOUT_URL,
    method: "delete",
    onCompleted: () => {
      dispatch(logoutUser());
      const iotService = IotService.getInstance();
      iotService.unsubscribeAll();
    },
  });

  dispatch(action);
};

const loadUserGroups = (): ApiAction<Group[]> =>
  apiAction({
    url: `${GROUPS_URL}`,
    asyncType: USER_GROUPS_GET_ASYNC,
    method: "get",
    onSuccess: (groups, dispatch) => {
      dispatch(userGroups(groups));
    },
  });

const getIotCreds = (): ApiAction =>
  apiAction({
    url: AUTH_AWS_IOT_URL,
    method: "get",
    includeAuthorization: true,
    onSuccess: (iotCredentials, dispatch) => {
      setIotCreds(iotCredentials);
      dispatch(setCredentials(iotCredentials));
    },
  });

/** Helper */
export const setIotCreds = (iotCredentials) => {
  const iotService = IotService.getInstance();
  iotService.updateMqttClient(iotCredentials);
};

const pingServer = (): ApiAction =>
  apiAction({
    url: `${PING_SERVER_URL}`,
    asyncType: PING_SERVER_GET_ASYNC,
    method: "get",
    onFailure: (message, dispatch) => {
      dispatch(logoutUser());
    },
  });

const selectEmployee = (employee: Employee): SelectEmployeeAction => ({
  type: SET_EMPLOYEE,
  payload: employee,
});

const getSessionDetails = (employeeId: string) =>
  apiAction({
    url: SESSION_DETAILS_URL,
    method: "get",
    onSuccess: (data: any, dispatch) => {
      const employee = data.employees.find(
        (employee: any) => employee.id === employeeId,
      );
      const company = employee.company;
      dispatch(companyActions.selectCompany(company));
      dispatch(selectEmployee(employee));
    },
  });

const clearNonAuthData = (): ClearNonAuthDataAction => ({
  type: CLEAR_NON_AUTH_DATA,
});

export default {
  authUser,
  logoutUser,
  login,
  logout,
  loginWithCode,
  getIotCreds,
  loadUserGroups,
  pingServer,
  selectEmployee,
  editCurrentEmployee,
  editSelectedEmployee,
  signup,
  forgotPassword,
  confirmNewPassword,
  userGroups,
  editUser,
  getSessionDetails,
  newUserSetPassword,
  clearNonAuthData,
  resendSignupEmail,
  toggleCustomLabels,
};
