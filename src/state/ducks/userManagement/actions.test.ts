import faker from "faker";
import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import { Group } from "../auth/types";
import { getUser } from "../common/tests/factories";
import actions from "./actions";
import { EMPLOYEES_URL, GROUPS_ME_URL, GROUPS_URL } from "./constants";
import { getCompanyGroup, getGroup } from "./tests/factories";
import { AddEmployeeRequest, EmployeeGroupsEditRequestBody, GetEmployeeResponse, LoadCompanyGroups } from "./types";

describe(" survey management actions test", () => {
  const companyGroup: LoadCompanyGroups = [getCompanyGroup()];

  describe("loadCompanyGroups test", () => {
    const action = actions.loadCompanyGroups();
    it("calls GET on GROUPS_URL", () => {
      expect(action.url).toBe(`${GROUPS_URL}`);
      expect(action.method).toBe("get");
    });
    it("calls dispatch with companyGroupsList action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(companyGroup, dispatch);
      expect(dispatch).toHaveBeenLastCalledWith(
        actions.companyGroupsList(companyGroup),
      );
    });
  });

  describe("addEmployee test", () => {
    const data: AddEmployeeRequest = {
      user: getUser(),
      groups: null,
    };
    const handlers: Handlers = {
      successHandler: getCallbackHandler(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.addEmployee(data, handlers);

    it("calls POST on EMPLOYEES_URL", () => {
      expect(action.url).toBe(`${EMPLOYEES_URL}`);
      expect(action.method).toBe("post");
    });
  });

  describe("getEmployee test", () => {
    const params: any = {};
    const handlers: Handlers<GetEmployeeResponse[]> = {
      successHandler: getCallbackHandler<GetEmployeeResponse[]>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.getEmployee(params, handlers);

    it("calls GET on EMPLOYEES_URL", () => {
      expect(action.url).toBe(`${EMPLOYEES_URL}`);
      expect(action.method).toBe("get");
    });
  });

  describe("loadGroupsMe test", () => {
    const handlers: Handlers<Group[]> = {
      successHandler: getCallbackHandler<Group[]>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.loadGroupsMe(handlers);

    it("calls GET on GROUPS_ME_URL", () => {
      expect(action.url).toBe(`${GROUPS_ME_URL}`);
      expect(action.method).toBe("get");
    });
  });

  describe("editEmployeeGroups test", () => {
    const employee: GetEmployeeResponse = {
      id: faker.random.uuid(),
      active: true,
      groups: [getGroup()],
      user: getUser(),
    };
    const employeeId = faker.random.uuid();
    const body: EmployeeGroupsEditRequestBody = {
      groups: [
        {
          id: faker.random.uuid(),
        },
      ],
    };
    const handlers: Handlers<Group[]> = {
      successHandler: getCallbackHandler<Group[]>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.editEmployeeGroups(employeeId, body, handlers);
    it("calls PATCH on EMPLOYEES_URL/employeeId", () => {
      expect(action.url).toBe(`${EMPLOYEES_URL}/${employeeId}`);
      expect(action.method).toBe("patch");
    });
    it("calls dispatch with editSelectedEmployeeGroups action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(employee, dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        actions.editSelectedEmployeeGroups(employee),
      );
    });
  });
});
