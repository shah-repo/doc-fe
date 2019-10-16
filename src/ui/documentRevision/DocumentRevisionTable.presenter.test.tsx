import React from "react";
import { shallow } from "enzyme";
import { DocumentRevisionTable, DocumentRevisionTableProps } from "./DocumentRevisionTable.presenter";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import faker from "faker";
import { AutoSizer, Column } from "react-virtualized";

describe("DocumentRevisionTable test", () => {
  const defaultProps: DocumentRevisionTableProps = {
      documentRevisions: [getDocumentRevision()],
      currentUserEmail: faker.internet.email(),
      editDocumentRevision: jest.fn(),
      previewDocumentRevision: jest.fn(),
      classes: {
        actions: "",
        root: "",
        table: "",
        flexContainer: "",
        tableRow: "",
      },
  };

  const getWrapper = (props: Partial<DocumentRevisionTableProps>= {}) => shallow (
    <DocumentRevisionTable {...defaultProps} {...props}/>,
  );

  it("", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(AutoSizer).dive().find(Column)).toHaveLength(8);
  });
});
