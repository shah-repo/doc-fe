import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import ReferencePresenter from "./reference.presenter";
import { Props,  ReferencedByContainer } from "./referencedBy.container";

describe("ReferencedByContainer tests", () => {
  const defaultProps: Props = {
    dataProp: [
      {
        id: faker.random.uuid(),
        name: faker.lorem.word(),
        document: {
          id: faker.random.uuid(),
          docId: faker.random.uuid(),
          documentType: faker.lorem.word(),
          referencedBy: [],
        },
      },
    ],
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <ReferencedByContainer {...defaultProps} {...props}/>,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ReferencePresenter).exists()).toBe(true);
  });
});
