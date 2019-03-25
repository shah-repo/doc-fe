import { shallow } from "enzyme";
import React from "react";
import { getDocument } from "../../state/ducks/documents/tests/factories";
import { AsyncStatus } from "../../state/types";
import getFormikActions from "../tests/helpers/getFormikActions";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import { DocumentCreateContainer, DocumentCreateContainerProps } from "./DocumentCreate.container";
import DocumentFormContainer from "./forms/DocumentForm.container";
import { toDocumentEditRequestBody } from "./forms/transform";
import { DocumentFormValues } from "./forms/types";
import { generateDocumentEditPath } from "./pathGenerators";

jest.mock("../hooks/useCallbackHandler", () => (fn: any) => fn);

describe("DocumentCreateContainer tests", () => {
  const routeComponentProps = getRouteComponentProps();

  const defaultProps: DocumentCreateContainerProps = {
    ...routeComponentProps,
    asyncState: {
      status: AsyncStatus.Idle,
      message: "",
    },
    create: jest.fn(),
  };

  const getWrapper = (props: Partial<DocumentCreateContainerProps>) => shallow(
    <DocumentCreateContainer {...defaultProps} {...props} />,
  );

  const values: DocumentFormValues = {
    name: "",
    type: "",
    approvers: [],
    attachments: [],
  };

  const actions = getFormikActions<DocumentFormValues>();

  it("calls onSubmit and redirects to document edit on success", () => {
    const create = jest.fn();
    const wrapper = getWrapper({ create });

    const form = wrapper.find(DocumentFormContainer);

    form.prop("onSubmit")(values, actions);

    expect(create).toHaveBeenCalledTimes(1);
    const createParameters = create.mock.calls[0];

    expect(createParameters[0]).toEqual(toDocumentEditRequestBody(values));
    expect(createParameters[1]).toBeDefined();
    expect(actions.setSubmitting).toHaveBeenCalledWith(false);

    const document = getDocument();
    createParameters[1](document);

    expect(routeComponentProps.history.push).toHaveBeenCalledWith(generateDocumentEditPath(document.id));
  });
});
