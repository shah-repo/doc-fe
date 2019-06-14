import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import { getUser } from "../../state/ducks/common/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import {
  DocumentRevisionUpdateContainer,
  DocumentRevisionUpdateContainerProps,
} from "./DocumentRevisionUpdate.container";
import DocumentRevisionFormContainer from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import DocumentRevisionPreviewPresenter from "./DocumentRevisionPreview.presenter";

describe("DocumentRevisionUpdateContainer tests", () => {
  const currentUserEmail = faker.internet.email();
  const notExistingEmail = "does.not.exist@codecons.com";
  const documentRevision = getDocumentRevision({
    status: DocumentRevisionStatus.Draft,
    owner: getUser({
      email: currentUserEmail,
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
    const values = toDocumentRevisionFormValues(documentRevision);

    form.prop("onSubmit")(values);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(
      documentRevision.id,
      toDocumentRevisionEditRequestBody(values),
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
    const preview = wrapper.find(DocumentRevisionPreviewPresenter).first();

    expect(preview).toBeDefined();
    expect(preview.prop("documentRevision")).toEqual(documentRevision);
  });
});
