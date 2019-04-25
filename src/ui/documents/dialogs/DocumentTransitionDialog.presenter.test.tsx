import { Button, Dialog } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import { PasswordFormValues } from "../forms/types";
import DocumentTransitionDialogPresenter, {
  DocumentTransitionDialogPresenterProps,
} from "./DocumentTransitionDialog.presenter";

jest.mock("@material-ui/core/Dialog", () => (props: any) => (
  <div>
    {props.children}
  </div>
));

jest.mock("../../components/Text");

describe("DocumentTransitionDialogPresenter tests", () => {
  const props: DocumentTransitionDialogPresenterProps = {
    onSubmit: jest.fn(),
    closeDialog: jest.fn(),
    openDialog: jest.fn(),
    isDialogOpen: true,
    asyncState: ASYNC_DEFAULT_STATE,
    transition: "approve",
  };

  const wrapper = mount(
    <DocumentTransitionDialogPresenter {...props} />,
  );

  it("calls openDialog on Button click", () => {
    wrapper.find(Button).first().simulate("click");
    expect(props.openDialog).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit on form submission", () => {
    const values: PasswordFormValues = { password: "TEST" };
    wrapper.find("Formik").prop("onSubmit")(values);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("passes isDialogOpen prop", () => {
    expect(wrapper.find(Dialog).prop("open")).toEqual(props.isDialogOpen);
  });
});
