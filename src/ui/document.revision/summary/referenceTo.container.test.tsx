import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import ReferencePresenter from "./reference.presenter";
import { Props,  ReferenceToContainer } from "./referenceTo.container";

describe("ReferencedToContainer tests", () => {
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
    status: "RELEASED",
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ReferenceToContainer {...defaultProps} {...props}/>,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ReferencePresenter).exists()).toBe(true);

  });
});
