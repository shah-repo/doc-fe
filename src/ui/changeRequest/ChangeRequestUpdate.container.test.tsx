import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { ChangeRequestStatus } from "../../state/ducks/changeRequest";
import { getChangeRequest } from "../../state/ducks/changeRequest/tests/factories";
import { getOwner, getUser } from "../../state/ducks/common/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import {
  ChangeRequestUpdateContainer,
  ChangeRequestUpdateContainerProps,
} from "./ChangeRequestUpdate.container";
import ChangeRequestFormContainer from "./forms/ChangeRequestForm.container";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "./forms/transform";
import { generateChangeRequestPreviewPath } from "./pathGenerators";

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
    const wrapper = getWrapper({ save });

    const form = wrapper.find(ChangeRequestFormContainer);
    const values = toChangeRequestFormValues(changeRequest);

    form.prop("onSubmit")(values);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(
      changeRequest.id,
      toChangeRequestEditRequestBody(values),
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
    expect(redirect.prop("to")).toEqual(generateChangeRequestPreviewPath(changeRequest.id));
  });
});
