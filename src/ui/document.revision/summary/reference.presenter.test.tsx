import { Grid, ListItem } from "@material-ui/core";
import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import Text from "../../components/Text";
import { Props,  ReferencePresenter } from "./reference.presenter";

describe("ReferencePresenter tests", () => {
  const defaultProps: Props = {
    label: faker.lorem.word(),
    dataProp: [
      {
        id: faker.random.uuid(),
        url: faker.internet.url(),
        title: faker.lorem.word(),
      },
      {
        id: faker.random.uuid(),
        url: faker.internet.url(),
        title: faker.lorem.word(),
      },
    ],
    classes: {
      box: "",
    },
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <ReferencePresenter {...defaultProps} {...props}/>,
  );

  it("Set props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Text).at(0).prop("message")).toEqual(defaultProps.label);
  });

  it("Renders references correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Grid).find(ListItem)).toHaveLength(2);
  });
});
