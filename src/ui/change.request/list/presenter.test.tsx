import { Button, Grid } from "@material-ui/core";
import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CHANGE_REQUEST_CREATE_URL } from "../../constants/urls";
import { ListPresenter,  Props } from "./presenter";

describe("Change request list presenter tests", () => {
  const defaultProps: Props = {
      tableName: faker.name.firstName(),
      tableCriteria: {
        queryDict: {},
      },
      tableData: [],
      clearFilter: jest.fn(),
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

  it("tableName is set correctly", () => {
      const wrapper = getWrapper();
      expect(wrapper.find(Grid).at(3).children().prop("tableName")).toEqual(defaultProps.tableName);
  });

  it("clear filter is called", () => {
      const wrapper = getWrapper();
      wrapper.find(Button).at(0).simulate("click");
      expect(defaultProps.clearFilter).toHaveBeenCalledTimes(1);
  });
});
