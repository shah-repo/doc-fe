import { shallow } from "enzyme";
import React from "react";
import CallbackHandler from "../../common/callbackHandler";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { getChangeRequest } from "../../state/ducks/changeRequest/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import {
  DEFAULT_INITIAL_VALUES,
  ChangeRequestCreateContainer,
  ChangeRequestCreateContainerProps,
} from "./ChangeRequestCreate.container";
import AssessmentFormContainer from "./forms/AssessmentForm.container";
import { toChangeRequestEditRequestBody } from "./forms/transform";
import { generateChangeRequestEditPath } from "./pathGenerators";

describe("ChangeRequestCreateContainer tests", () => {
  const defaultProps: ChangeRequestCreateContainerProps = {
    ...getRouteComponentProps(),
    create: jest.fn(),
  };

  const getWrapper = (props: Partial<ChangeRequestCreateContainerProps>) => shallow(
    <ChangeRequestCreateContainer {...defaultProps} {...props} />,
  );

  it("calls onSubmit and redirects to change request edit on success", () => {
    const create = jest.fn();
    const routeComponentProps = getRouteComponentProps();
    const wrapper = getWrapper({ ...routeComponentProps, create });

    const form = wrapper.find(AssessmentFormContainer);
    const values = DEFAULT_INITIAL_VALUES;

    form.prop("onSubmit")(values);

    expect(create).toHaveBeenCalledTimes(1);
    const createParameters = create.mock.calls[0];

    expect(createParameters[0]).toEqual(toChangeRequestEditRequestBody(values));
    expect(createParameters[1]).toBeDefined();

    const changeRequest = getChangeRequest();
    (createParameters[1].successHandler as CallbackHandler<ChangeRequest>).execute(changeRequest);

    expect(routeComponentProps.history.push).toHaveBeenCalledWith(generateChangeRequestEditPath(changeRequest.id));
  });

  it("sets default initialValues", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(AssessmentFormContainer);

    expect(form.prop("initialValues")).toEqual(DEFAULT_INITIAL_VALUES);
  });

  it("sets asyncState", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(AssessmentFormContainer);

    expect(form.prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });
});
