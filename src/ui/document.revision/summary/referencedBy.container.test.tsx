import { shallow } from "enzyme";
import React from "react";
import { ReferencedByContainer,  Props } from "./referencedBy.container";
import faker from "faker";
import ReferencePresenter from "./reference.presenter";

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
              referencedBy:  [],
            },
        },
    ],
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ReferencedByContainer {...defaultProps} {...props}/>,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ReferencePresenter).exists()).toBe(true);
  });
});
