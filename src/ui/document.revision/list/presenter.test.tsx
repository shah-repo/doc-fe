import { Grid } from "@material-ui/core";
import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import { ListPresenter, Props } from "./presenter";

describe("ListPresenter tests", () => {
  const defaultProps: Props = {
    tableName: faker.name.firstName(),
    tableCriteria: {
      queryDict: {},
    },
    tableData: [],
    currentUserEmail: faker.internet.email(),
    editDocumentRevision: jest.fn(),
    setDocId: jest.fn(),
    previewDocumentRevision: jest.fn(),
    documentTypeOptions: [{
      value: faker.lorem.word(),
      text: faker.lorem.word(),
    }],
    classes: {
      root: "",
      button: "",
      item: "",
      link: "",
      clearButton: "",
    },
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <ListPresenter {...defaultProps} {...props}/>,
  );
  it("RouterLink props are set correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(RouterLink).prop("to")).toEqual(DOCUMENT_REVISION_CREATE_URL);
  });

  it("tableName is set correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Grid).at(3).children().prop("tableName")).toEqual(defaultProps.tableName);
  });
});
