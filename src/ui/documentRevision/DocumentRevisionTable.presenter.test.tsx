import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { AutoSizer, Column } from "react-virtualized";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import { DocumentRevisionTable, DocumentRevisionTableProps } from "./DocumentRevisionTable.presenter";

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
