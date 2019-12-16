import faker from "faker";
import { getEmployee } from "../company/tests/factories";
import { AUTH_USER, LOGOUT_USER } from "./constants";
import { user, USER_DEFAULT_STATE } from "./reducers";
import { AuthResponse, AuthUserAction, LogoutUserAction } from "./types";

describe("user reducer tests", () => {
  const payload: AuthResponse = {
    ExpiresAt: faker.date.future().toISOString(),
    ExpiresIn: faker.random.number(),
    email: "dino@codecons.com",
    id: "1",
    name: "Dino",
    sessionId: faker.random.uuid(),
    avatar: null,
    employees: [getEmployee()],
  };

  it("sets user email", () => {
    const action: AuthUserAction = { type: AUTH_USER, payload };

    expect(user(undefined, action)).toEqual({
      email: payload.email,
      id: payload.id,
      name: payload.name,
      employeeId: payload.employees[0].id,
      sessionId: payload.sessionId,
      avatar: payload.avatar,
      employees: payload.employees,
      groups: [],
    });
  });

  it("resets state on user logout", () => {
    const action: LogoutUserAction = { type: LOGOUT_USER };

    expect(user(undefined, action)).toEqual(USER_DEFAULT_STATE);
  });
});
