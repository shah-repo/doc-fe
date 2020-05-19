import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getOwner, getUser } from "../../state/ducks/common/tests/factories";
import { DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import { DocumentRevisionUpdateContainer, DocumentRevisionUpdateContainerProps } from "./DocumentRevisionUpdate.container";
import DocumentRevisionFormContainer from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionFormValues } from "./forms/transform";

describe("DocumentRevisionUpdateContainer tests", () => {
  const currentUserEmail = faker.internet.email();
  const notExistingEmail = "does.not.exist@codecons.com";
  const documentRevision = getDocumentRevision({
    status: DocumentRevisionStatus.Draft,
    owner: getOwner({
      user: getUser({
        email: currentUserEmail,
      }),
    }),
  });

  const defaultProps: DocumentRevisionUpdateContainerProps = {
    save: jest.fn(),
    currentUserEmail,
    documentRevision,
  };

  const getWrapper = (props: Partial<DocumentRevisionUpdateContainerProps>) => shallow(
    <DocumentRevisionUpdateContainer {...defaultProps} {...props} />,
  );

  it("calls save method on form submit", () => {
    const save = jest.fn();
    const wrapper = getWrapper({ save });

    const form = wrapper.find(DocumentRevisionFormContainer);
    const submitPayload = { description: "Changed desription" };
    const values = toDocumentRevisionFormValues({
      ...documentRevision,
      ...submitPayload,
    });

    form.prop("onSubmit")(values);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(
      documentRevision.id,
      submitPayload,
      expect.anything(),
    );
  });

  it("sets props", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(DocumentRevisionFormContainer);

    expect(form.prop("initialValues")).toEqual(toDocumentRevisionFormValues(documentRevision));
    expect(form.prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });

  it("shows preview when cannot edit document revision", () => {
    const wrapper = getWrapper({
      currentUserEmail: notExistingEmail,
    });
    const preview = wrapper.find(DocumentRevisionSummaryPresenter).first();

    expect(preview).toBeDefined();
    expect(preview.prop("dataProp")).toEqual(documentRevision);
  });
});
