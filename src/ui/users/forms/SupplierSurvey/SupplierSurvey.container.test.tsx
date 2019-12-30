import { wait } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Route, Switch } from "react-router-dom";
import apiInstance from "../../../../state/apiClient";
import { SUPPLIER_SURVEY_URL } from "../../../constants/urls";
import render from "../../../tests/helpers/renderWithStore";
import SupplierSurveyContainer from "./SupplierSurvey.container";
import { surveyResponse } from "./tests/responses";

const apiMock = new MockAdapter(apiInstance);

jest.mock("../../../components/Text");

describe("Supplier survey container test", () => {
  const SURVEY_TOKEN = "SURVEY_TOKEN";
  const url = `supplier_survey_requests/${SURVEY_TOKEN}`;

  beforeEach(() => {
    apiMock.onGet(url).reply(200, surveyResponse);
  });

  afterEach(() => {
    apiMock.reset();
  });

  it("redirects to home if user is logged in", () => {
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
        <Route path={SUPPLIER_SURVEY_URL} exact={true} render={(props) => <SupplierSurveyContainer {...props} />} />
        <Route path="/" exact={true} render={() => <div>After redirect</div>} />
      </Switch>
    );
    const { container } = render(<Routes />, { customState, route: "/supplier_survey/123" });

    expect(container.innerHTML).toMatch("<div>After redirect</div>");
  });

  it("renders the survey", async () => {
    const Routes = () => (
      <Switch>
        <Route path={SUPPLIER_SURVEY_URL} exact={true} render={(props) => <SupplierSurveyContainer {...props} />} />
      </Switch>
    );
    const { asFragment, getByRole } = render(
      <Routes />,
      { route: `/supplier_survey/${SURVEY_TOKEN}` },
    );

    expect(getByRole("progressbar")).toBeInTheDocument();

    await wait(() => {});

    expect(asFragment()).toMatchSnapshot();
  });
});
