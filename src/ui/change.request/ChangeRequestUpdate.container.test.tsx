import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getChangeRequest } from "../../state/ducks/changeRequest/tests/factories";
import { ChangeRequestStatus } from "../../state/ducks/changeRequest/types";
import { getOwner, getUser } from "../../state/ducks/common/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import { ChangeRequestUpdateContainer, ChangeRequestUpdateContainerProps } from "./ChangeRequestUpdate.container";
import ChangeRequestFormContainer from "./form/ChangeRequestForm.container";
import { toChangeRequestFormValues } from "./form/transform";
import { changeRequestPreviewPath } from "./utils/paths";

describe("ChangeRequestUpdateContainer tests", () => {
  const currentUserEmail = faker.internet.email();
  const notExistingEmail = "does.not.exist@codecons.com";
  const changeRequest = getChangeRequest({
    state: ChangeRequestStatus.Draft,
    owner: getOwner({
      user: getUser({
        email: currentUserEmail,
      }),
    }),
  });

  const defaultProps: ChangeRequestUpdateContainerProps = {
    save: jest.fn(),
    currentUserEmail,
    changeRequest,
  };

  const getWrapper = (props: Partial<ChangeRequestUpdateContainerProps>) => shallow(
    <ChangeRequestUpdateContainer {...defaultProps} {...props} />,
  );

  it("calls save method on form submit", () => {
    const save = jest.fn();
    const wrapper = getWrapper({ save, changeRequest });

    const form = wrapper.find(ChangeRequestFormContainer);
    const submitPayload = { description: "Changed desription" };
    const values = toChangeRequestFormValues({
      ...changeRequest,
      ...submitPayload,
    });

    form.prop("onSubmit")(values);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(
      changeRequest.id,
      submitPayload,
      expect.anything(),
    );
  });

  it("sets props", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(ChangeRequestFormContainer);

    expect(form.prop("initialValues")).toEqual(toChangeRequestFormValues(changeRequest));
    expect(form.prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("redirects when cannot edit change request", () => {
    const wrapper = getWrapper({
      currentUserEmail: notExistingEmail,
    });
    const redirect = wrapper.find("Redirect").first();

    expect(redirect).toBeDefined();
    expect(redirect.prop("to")).toEqual(changeRequestPreviewPath(changeRequest.id));
  });
});
