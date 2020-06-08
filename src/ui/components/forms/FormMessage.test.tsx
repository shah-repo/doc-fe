import { mount } from "enzyme";
import React from "react";
import { AsyncStatus } from "../../../state/types";
import { toastError } from "../notifications";
import FormMessage, { FormMessageProps } from "./FormMessage";

jest.mock("../Text");
jest.mock("../notifications");

describe("FormMessage component unit tests", () => {
  const getWrapper = (props: FormMessageProps) => mount(
    <FormMessage {...props} />,
  );

  it("displays toast error", () => {
    getWrapper({
      asyncState: {
        status: AsyncStatus.Error,
        message: "Error message",
      },
    });
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenLastCalledWith("Error message");
  });
});
