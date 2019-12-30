import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Route, Switch } from "react-router-dom";
import apiInstance from "../../../../state/apiClient";
import render from "../../../tests/helpers/renderWithStore";
import SupplierSurveyContainer from "./SupplierSurvey.container";

const apiMock = new MockAdapter(apiInstance);

jest.mock("../../../components/Text");

const mockResponse = [
  {
    id: "8d785119-e164-4e00-940b-0e049bb4227d",
  },
  {
    id: "e6280257-8d30-47ec-8984-d2f46b0535cb",
  },
];

describe("Supplier survey container test", () => {
  const url = "/change_requests";
  const title = "Test search";

  beforeEach(() => {
    apiMock.onGet(url).reply((config) => {
      // workaround, couldn't get params to work
      if (config.params.title === title) {
        return [200, mockResponse.splice(1)];
      } else {
        return [200, mockResponse];
      }
    });
  });

  afterEach(() => {
    apiMock.reset();
  });

  it("redirects to home if user is logged in", async () => {
    const customState = {
      auth: {
        user: {
          employeeId: "employeeId",
          sessionId: "sessionId",
        },
      },
    };
    const Routes = () => (
      <Switch>
        <Route path="/survey" exact={true} render={(props) => <SupplierSurveyContainer {...props} />} />
        <Route path="/" exact={true} render={() => <div>After redirect</div>} />
      </Switch>
    );
    const { container } = render(<Routes />, { customState, route: "/survey" });

    expect(container.innerHTML).toMatch("<div>After redirect</div>");
  });
});
