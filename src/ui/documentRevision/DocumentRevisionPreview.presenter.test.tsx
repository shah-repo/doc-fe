import { Typography } from "@material-ui/core";
import { shallow } from "enzyme";
import React from "react";
import { Link } from "react-router-dom";
import { getAttachment } from "../../state/ducks/attachments/tests/factories";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import FileCard from "../components/cards/FileCard";
import {
    DocumentRevisionPreviewPresenter,
    DocumentRevisionPreviewPresenterProps,
} from "./DocumentRevisionPreview.presenter";
import PreviewControlsContainer from "./PreviewControls.container";

describe("DocumentRevisionPreviewPresenter test with no documentRevision", () => {
    const defaultProps: DocumentRevisionPreviewPresenterProps  = {
        documentRevision: null,
        classes: {
            container: "",
            actionButtons: "",
        },
    };

    const getWrapper = (props: Partial<DocumentRevisionPreviewPresenterProps>= {}) => shallow (
      <DocumentRevisionPreviewPresenter {...defaultProps} {...props}/>,
    );

    it("Returns null if there is no document revision", () => {
      const wrapper = getWrapper();
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });

describe("DocumentRevisionPreviewPresenter test with documentRevision", () => {
  const defaultProps: DocumentRevisionPreviewPresenterProps  = {
      documentRevision: {
        ...getDocumentRevision(),
         attachments: [getAttachment()],
         document: {
             ...getDocumentRevision().document,
             referencedBy: [getDocumentRevision()],
         },
        },
      classes: {
          container: "",
          actionButtons: "",
      },
  };

  const getWrapper = (props: Partial<DocumentRevisionPreviewPresenterProps>= {}) => shallow (
    <DocumentRevisionPreviewPresenter {...defaultProps} {...props}/>,
  );

  it("Sets props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(PreviewControlsContainer).prop("documentRevision")).toEqual(defaultProps.documentRevision);
    expect(wrapper.find(FileCard).prop("attachment")).toEqual(defaultProps.documentRevision!.attachments[0]);
  });

  it("Displays attachments and references correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.find(Link)).toHaveLength(1);
    expect(wrapper.find(FileCard)).toHaveLength(1);
  });

  it("Sets props correctly", () => {
    const wrapper = getWrapper();
    const docRev = defaultProps.documentRevision!;
    const typography = wrapper.find(Typography);

    expect(typography.at(1).contains(docRev.document.docId));
    expect(typography.at(2).contains(docRev.status));
    expect(typography.at(4).contains(docRev.document.documentType.documentTypeName));
    expect(typography.at(6).contains(docRev.description));
    expect(typography.at(8).contains(docRev.name));
  });
});
