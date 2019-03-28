import { shallow } from "enzyme";
import React from "react";
import CallbackHandler from "../../common/callbackHandler";
import { Document } from "../../state/ducks/documents";
import { getDocument } from "../../state/ducks/documents/tests/factories";
import { AsyncStatus } from "../../state/types";
import getFormikActions from "../tests/helpers/getFormikActions";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import {
  DEFAULT_INITIAL_VALUES,
  DocumentCreateContainer,
  DocumentCreateContainerProps,
} from "./DocumentCreate.container";
import DocumentFormContainer from "./forms/DocumentForm.container";
import { toDocumentEditRequestBody, toDocumentFormValues } from "./forms/transform";
import { DocumentFormValues } from "./forms/types";
import { generateDocumentEditPath } from "./pathGenerators";

describe("DocumentCreateContainer tests", () => {
  const defaultProps: DocumentCreateContainerProps = {
    ...getRouteComponentProps(),
    asyncState: {
      status: AsyncStatus.Idle,
      message: "",
    },
    create: jest.fn(),
  };

  const getWrapper = (props: Partial<DocumentCreateContainerProps>) => shallow(
    <DocumentCreateContainer {...defaultProps} {...props} />,
  );

  it("calls onSubmit and redirects to document edit on success", () => {
    const create = jest.fn();
    const routeComponentProps = getRouteComponentProps();
    const wrapper = getWrapper({ ...routeComponentProps, create });

    const form = wrapper.find(DocumentFormContainer);
    const actions = getFormikActions<DocumentFormValues>();
    const values = DEFAULT_INITIAL_VALUES;

    form.prop("onSubmit")(values, actions);

    expect(create).toHaveBeenCalledTimes(1);
    const createParameters = create.mock.calls[0];

    expect(createParameters[0]).toEqual(toDocumentEditRequestBody(values));
    expect(createParameters[1]).toBeDefined();
    expect(actions.setSubmitting).toHaveBeenCalledWith(false);

    const document = getDocument();
    (createParameters[1] as CallbackHandler<Document>).execute(document);

    expect(routeComponentProps.history.push).toHaveBeenCalledWith(generateDocumentEditPath(document.id));
  });

  it("sets default initialValues", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(DocumentFormContainer);

    expect(form.prop("initialValues")).toEqual(DEFAULT_INITIAL_VALUES);
  });

  it("sets initialValues from document", () => {
    const document = getDocument();
    const wrapper = getWrapper({ document });
    const form = wrapper.find(DocumentFormContainer);

    expect(form.prop("initialValues")).toEqual(toDocumentFormValues(document));
  });

  it("sets asyncState", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(DocumentFormContainer);

    expect(form.prop("asyncState")).toEqual(defaultProps.asyncState);
  });
});
