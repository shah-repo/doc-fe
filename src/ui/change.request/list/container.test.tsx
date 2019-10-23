import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getChangeRequest } from "../../../state/ducks/changeRequest/tests/factories";
import getRouteComponentProps from "../../tests/helpers/getRouteComponentProps";
import { ListContainer,  Props } from "./container";
import ListPresenter from "./presenter";

describe("Approvers tests", () => {
  const defaultProps: Props = {
      dataProp: getChangeRequest(),
      currentUserEmail: faker.internet.email(),
      loadChangeRequests: jest.fn(),
  } as unknown as Props;

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ListContainer {...defaultProps} {...getRouteComponentProps()} {...props}/>,
  );

  it("dataProp is set correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ListPresenter).prop("dataProp")).toEqual(defaultProps.dataProp);
  });
});
