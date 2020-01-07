import { fireEvent, wait } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import apiInstance from "../../../state/apiClient";
import render from "../../tests/helpers/renderWithProviders";
import ListContainer from "./container";

const apiMock = new MockAdapter(apiInstance);

jest.mock("../../components/Text");

const mockResponse = [
  {
    id: "8d785119-e164-4e00-940b-0e049bb4227d",
  },
  {
    id: "e6280257-8d30-47ec-8984-d2f46b0535cb",
  },
];

describe("Change Request list container test", () => {
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

  it("renders empty on mount", async () => {
    const { asFragment, getByTestId } = render(<ListContainer />);
    const numberOfRecords = getByTestId("numberOfRecords");

    expect(asFragment()).toMatchSnapshot();
    expect(numberOfRecords.innerHTML).toEqual("0");
  });

  it("renders two items after API response", async () => {
    const { getByTestId } = render(<ListContainer />);
    const numberOfRecords = getByTestId("numberOfRecords");

    await wait(() => {
      expect(numberOfRecords.innerHTML).toEqual("2");
    });

  });

  it("renders one item after search", async () => {
    const { container, getByTestId } = render(<ListContainer />);
    const titleInput = container.querySelector("[name='title']");
    const numberOfRecords = getByTestId("numberOfRecords");

    await wait(() => {});

    fireEvent.change(titleInput!, { target: { value: title } });

    await wait(() => {
      expect(numberOfRecords.innerHTML).toEqual("1");
    });
  });
});
