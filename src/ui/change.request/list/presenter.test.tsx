import { shallow } from "enzyme";
import React from "react";
import { ListPresenter,  Props } from "./presenter";
import { getChangeRequest } from "../../../state/ducks/changeRequest/tests/factories";
import faker from "faker";
import { Grid } from "@material-ui/core";
import { CHANGE_REQUEST_CREATE_URL } from "../../constants/urls";
import { Link as RouterLink } from "react-router-dom";

describe("Approvers tests", () => {
  const defaultProps: Props = {
      dataProp: [getChangeRequest()],
      currentUserEmail: faker.internet.email(),
      editChangeRequest: jest.fn(),
      previewChangeRequest: jest.fn(),
      classes: {
          clearButton: "",
          root: "",
          button: "",
          item: "",
          link: "",
      },
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ListPresenter {...defaultProps} {...props}/>,
  );

  it("RouterLink props are set correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(RouterLink).prop("to")).toEqual(CHANGE_REQUEST_CREATE_URL);
  });

  it("tableData is set correctly", () => {
      const wrapper = getWrapper();
      expect(wrapper.find(Grid).at(3).children().prop("tableData")).toEqual(defaultProps.dataProp);
  });
});
