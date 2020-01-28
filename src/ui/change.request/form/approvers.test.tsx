import { wait } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import apiInstance from "../../../state/apiClient";
import render from "../../tests/helpers/renderWithProviders";
import Approvers from "./approvers";
import { approversResponse } from "./tests/response";

jest.mock("../../components/forms/fields/Autocomplete/Autocomplete.tsx",
  () => () => <div data-testid="autocomplete">Autocomplete</div>,
);
describe("Change request form Approvers tests", () => {
  const apiMock = new MockAdapter(apiInstance);

  beforeEach(() => {
    apiMock.onGet("change_requests/available_approvers").reply(200, approversResponse);
  });

  afterEach(() => {
    apiMock.reset();
  });

  it("Sets options prop correctly", async () => {
    const { getByRole, getByTestId } = render(<Approvers />);

    expect(getByRole("progressbar")).toBeInTheDocument();

    await wait();

    // TODO: component needs formik in context
    // this is a quick refactoring of the original test
    expect(getByTestId("autocomplete")).toBeInTheDocument();
  });
});
