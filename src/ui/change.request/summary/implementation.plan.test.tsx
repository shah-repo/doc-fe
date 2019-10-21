import { shallow } from "enzyme";
import React from "react";
import { ImplementationPlan,   Props } from "./implementation.plan";
import faker from "faker";
import { Grid } from "@material-ui/core";
import SummaryField from "../../common/summary/base";
import CloseTask from "./close.task";

describe("ImplementationPlan with tasks tests", () => {
  const defaultProps: Props = {
    currentUserEmail: "test@gmail.com",
    crStatus: "APPROVED" ,
    closeTask: jest.fn(),
    crId: faker.random.uuid(),
    dataProp:   {
        id: faker.random.uuid(),
        tasks: [{
            id: faker.random.uuid(),
            title: faker.lorem.word(),
            description: faker.lorem.paragraph(),
            dueDate: faker.date.recent(),
            createdAt: faker.date.recent(),
            closeDate: faker.date.recent(),
            status: "PENDING",
            updatedAt: faker.date.recent(),
            closingNote: faker.lorem.word(),
            assigned: {
                id: faker.random.uuid(),
                name: faker.name.firstName(),
                email: "test@gmail.com",
              },
          }],
        attachments: [],
      },
      classes: {
          box: "",
          taskContainer: "",
          taskDescription: "",
          taskBasicInformation: "",
    },
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ImplementationPlan {...defaultProps} {...props}/>,
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(SummaryField).exists()).toBe(true);
  });

  it("Displays Close Task if task is assigned and user is authorized to close task", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(CloseTask).exists()).toBe(true);
});
});

describe("ImplementationPlan without tasks tests", () => {
    const defaultProps: Props = {
      currentUserEmail: faker.internet.email(),
      crStatus: "APPROVED" ,
      closeTask: jest.fn(),
      crId: faker.random.uuid(),
      dataProp:   {
          id: faker.random.uuid(),
          tasks: [],
          attachments: [],
        },
        classes: {
            box: "",
            taskContainer: "",
            taskDescription: "",
            taskBasicInformation: "",
      },
    };

    const getWrapper = (props: Partial<Props>= {}) => shallow(
      <ImplementationPlan {...defaultProps} {...props}/>,
    );

    it("Displays correctly", () => {
      const wrapper = getWrapper();
      expect(wrapper.find(Grid)).toHaveLength(1);
    });

    it("Doesn't display Close Task if task is not assigned", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(CloseTask).exists()).toBe(false);
      });
  });
