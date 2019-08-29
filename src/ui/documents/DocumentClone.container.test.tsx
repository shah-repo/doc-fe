import { shallow } from "enzyme";
import React from "react";
import { DocumentStatus } from "../../state/ducks/documents";
import { getDocument } from "../../state/ducks/documents/tests/factories";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import {
  DocumentCloneContainer,
  DocumentCloneContainerProps,
} from "./DocumentClone.container";
import DocumentCreateContainer from "./DocumentCreate.container";
import { generateDocumentPreviewPath } from "./pathGenerators";
import { DocumentRouteParams } from "./types";

describe("DocumentCloneContainer tests", () => {
  const document = getDocument({
    status: DocumentStatus.Approved,
  });
  const defaultProps: DocumentCloneContainerProps = {
    ...getRouteComponentProps<DocumentRouteParams>({
      documentId: document.id,
    }),
    document,
  };

  const getWrapper = (props: Partial<DocumentCloneContainerProps>) => shallow(
    <DocumentCloneContainer {...defaultProps} {...props} />,
  );

  it("sets correct props", () => {
    const wrapper = getWrapper({});
    const form = wrapper.find(DocumentCreateContainer);

    expect(form.prop("document")).toEqual(document);
  });

  it("redirects when cannot edit document", () => {
    const wrapper = getWrapper({
      document: {
        ...document,
        status: DocumentStatus.Draft,
      },
    });
    const redirect = wrapper.find("Redirect").first();

    expect(redirect).toBeDefined();
    expect(redirect.prop("to")).toEqual(generateDocumentPreviewPath(document.id));
  });
});
