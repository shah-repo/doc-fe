import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getOwner } from "../../state/ducks/common/tests/factories";
import { DocumentStatus } from "../../state/ducks/documents";
import { getDocument, getUser } from "../../state/ducks/documents/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import {
  DocumentUpdateContainer,
  DocumentUpdateContainerProps,
} from "./DocumentUpdate.container";
import DocumentFormContainer from "./forms/DocumentForm.container";
import { toDocumentEditRequestBody, toDocumentFormValues } from "./forms/transform";
import { generateDocumentPreviewPath } from "./pathGenerators";

describe("DocumentUpdateContainer tests", () => {
  const currentUserEmail = faker.internet.email();
  const notExistingEmail = "does.not.exist@codecons.com";
  const document = getDocument({
    status: DocumentStatus.Draft,
    owner: getOwner({
      user: getUser({
        email: currentUserEmail,
      }),
    }),
  });

  const defaultProps: DocumentUpdateContainerProps = {
    save: jest.fn(),
    currentUserEmail,
    document,
  };

  const getWrapper = (props: Partial<DocumentUpdateContainerProps>) => shallow(
    <DocumentUpdateContainer {...defaultProps} {...props} />,
  );

  it("calls save method on form submit", () => {
    const save = jest.fn();
    const wrapper = getWrapper({ save });

    const form = wrapper.find(DocumentFormContainer);
    const values = toDocumentFormValues(document);

    form.prop("onSubmit")(values);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(
      document.id,
      toDocumentEditRequestBody(values),
      expect.anything(),
    );
  });

  it("sets props", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(DocumentFormContainer);

    expect(form.prop("initialValues")).toEqual(toDocumentFormValues(document));
    expect(form.prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
    expect(form.prop("documentId")).toEqual(document.id);
  });

  it("redirects when cannot edit document", () => {
    const wrapper = getWrapper({
      currentUserEmail: notExistingEmail,
    });
    const redirect = wrapper.find("Redirect").first();

    expect(redirect).toBeDefined();
    expect(redirect.prop("to")).toEqual(generateDocumentPreviewPath(document.id));
  });
});
