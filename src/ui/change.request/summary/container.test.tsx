import { shallow } from "enzyme";
import React from "react";
import { Container, Props } from "./container";
import faker from "faker";
import { getChangeRequest } from "../../../state/ducks/changeRequest/tests/factories";
import SummaryPresenter from "../../changeRequest/documentRevision/DocumentRevisionControlPreview.presenter";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import ChangeRequestAuditContainer from "../../changeRequest/audit/Audit.container";
import { Formik, Form } from "formik";
import Presenter from "./presenter";

describe("Container tests", () => {
  const defaultProps: Props = {
    currentUserEmail: faker.internet.email(),
    dataProp: getChangeRequest(),
    save: jest.fn(),
    closeTask: jest.fn(),
    classes: {
        sidebar: "",
        root: "",
    },
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <Container {...defaultProps} {...props}/>,
  );

  it("Props are set correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(SummaryPresenter).prop("documentsInChangeRequest")).toEqual(defaultProps.dataProp.documentRevisions);
  });

  it("Displays correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(DocumentRevisionAuditContainer).exists()).toBe(false);
    expect(wrapper.find(ChangeRequestAuditContainer).exists()).toBe(true);
  });

  it("Formik displays and props are set correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Formik).dive().find(Form).find(Presenter).prop("dataProp")).toEqual(defaultProps.dataProp);
  });
});
