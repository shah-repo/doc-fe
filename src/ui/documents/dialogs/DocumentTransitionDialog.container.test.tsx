import { shallow } from "enzyme";
import React from "react";
import { PasswordFormValues } from "../forms/types";
import {
  DocumentTransitionDialogContainer,
  DocumentTransitionDialogContainerProps,
} from "./DocumentTransitionDialog.container";
import DocumentTransitionDialogPresenter from "./DocumentTransitionDialog.presenter";

describe("DocumentTransitionDialogContainer tests", () => {
  const defaultProps: DocumentTransitionDialogContainerProps = {
    documentId: "2131sad-sa-d-asd-",
    transition: "approve",
    applyTransition: jest.fn(),
  };

  const getWrapper = (props: Partial<DocumentTransitionDialogContainerProps>) => shallow(
    <DocumentTransitionDialogContainer {...defaultProps} {...props} />,
  );

  it("calls applyTransition on submit", () => {
    const props = { ...defaultProps };
    const wrapper = getWrapper(props);

    const presenter = wrapper.find(DocumentTransitionDialogPresenter);
    const values: PasswordFormValues = { password: "TEST" };

    presenter.prop("onSubmit")(values);

    expect(props.applyTransition).toHaveBeenCalledWith(props.documentId, values, props.transition, expect.anything());
  });

  it("sets proper transition", () => {
    const wrapper = getWrapper({ transition: "reject" });
    const presenter = wrapper.find(DocumentTransitionDialogPresenter);

    expect(presenter.prop("transition")).toEqual("reject");
  });
});
