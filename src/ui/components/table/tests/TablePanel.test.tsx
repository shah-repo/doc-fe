import { mount } from "enzyme";
import React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import localeEn from "react-intl/locale-data/en";
import { Document } from "../../../../state/ducks/documents/types";
import messagesEn from "../../../translations/en.json";
import { StyledTableHeader } from "../column/styles";
import { TableColumnProps } from "../column/types";
import { TablePanel } from "../panel";
import { TableSelectionProps } from "../types";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: () => ({
    queryDict: {},
    queryData: [],
  }),
}));

describe("TablePanel component tests", () => {
  addLocaleData([...localeEn]);
  const messages = { en: messagesEn };
  const language = "en";

  const noRowsTranslation = "table.no.results.found";
  // tslint:disable-next-line: no-unused-declaration
  let isActionSelected: boolean = false;

  const onActionSelect = ({ rowData, actionType }: TableSelectionProps<Document>) => () => {
    if (actionType === "EDIT") {
      isActionSelected = true;
    }
  };

  const columns: Array<TableColumnProps<Document>> = [
    {
      key: "name",
      label: "header.title",
    },
    {
      key: "owner",
      label: "header.title",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.email,
      },
    },
    {
      key: "type",
      label: "login.title",
      cellType: "LINK",
    },
    {
      key: "actions",
      label: "login.title",
      cellType: "ACTION",
      onSelect: onActionSelect,
      columnOptions: { cellDataGetter: () => ["EDIT"]},
      cellOptions: { align: "right" },
    },
  ];

  const getDocumentList = () => {
    return (
      <IntlProvider locale={language} messages={messages[language]}>
        <TablePanel<Document>
          columns={columns}
          noRowsTranslation={noRowsTranslation}
          tableName="table"
        />
      </IntlProvider>
    );
  };

  it("should mount", () => {
    const wrapper = mount(getDocumentList());

    // Render columns
    const tcolumns = wrapper.find(StyledTableHeader);
    expect(tcolumns).toHaveLength(columns.length);

    tcolumns.forEach((col, i) => {
      expect(col.text()).toEqual(messages[language][columns[i].label]);
    });
  });
});
