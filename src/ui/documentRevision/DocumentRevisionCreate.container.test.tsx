import { shallow } from "enzyme";
import React from "react";
import CallbackHandler from "../../common/callbackHandler";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../hooks/useAsync";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import {
  DEFAULT_INITIAL_VALUES,
  DocumentRevisionCreateContainer,
  DocumentRevisionCreateContainerProps,
} from "./DocumentRevisionCreate.container";
import DocumentRevisionFormContainer from "./forms/DocumentRevisionForm.container";
import { toNewVersionRequestBody } from "./forms/transform";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

describe("DocumentRevisionCreateContainer tests", () => {
  const defaultProps: DocumentRevisionCreateContainerProps = {
    ...getRouteComponentProps(),
    create: jest.fn(),
    setDocId: jest.fn(),
  };

  const getWrapper = (props: Partial<DocumentRevisionCreateContainerProps>) => shallow(
    <DocumentRevisionCreateContainer {...defaultProps} {...props} />,
  );

  it("calls onSubmit and redirects to document edit on success", () => {
    const create = jest.fn();
    const routeComponentProps = getRouteComponentProps();
    const wrapper = getWrapper({ ...routeComponentProps, create });

    const form = wrapper.find(DocumentRevisionFormContainer);
    const values = DEFAULT_INITIAL_VALUES();

    form.prop("onSubmit")(values);

    expect(create).toHaveBeenCalledTimes(1);
    const createParameters = create.mock.calls[0];

    expect(createParameters[0]).toEqual(toNewVersionRequestBody(values));
    expect(createParameters[1]).toBeDefined();

    const documentRevision = getDocumentRevision();
    (createParameters[1].successHandler as CallbackHandler<DocumentRevision>).execute(documentRevision);

    expect(routeComponentProps.history.push).toHaveBeenCalledWith(
      generateDocumentRevisionVersionPath(documentRevision.id, documentRevision.document.id),
    );
  });

  it("sets default initialValues", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(DocumentRevisionFormContainer);

    expect(form.prop("initialValues")).toEqual(DEFAULT_INITIAL_VALUES());
  });

  it("sets asyncState", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(DocumentRevisionFormContainer);

    expect(form.prop("asyncState")).toEqual(ASYNC_DEFAULT_STATE);
  });
});
