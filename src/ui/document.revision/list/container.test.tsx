import { mount } from "enzyme";
import React from "react";
import getRouteComponentProps from "../../tests/helpers/getRouteComponentProps";
import { ListContainer, Props} from "./container";
import { ListPresenter } from "./presenter";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((fn) => fn()),
  connect: (mapStateToProps: any, mapDispatchToProps: any) => (ReactComponent: any) => ({
    mapStateToProps,
    mapDispatchToProps,
    ReactComponent,
  }),
}));
jest.mock("../../components/Text");
jest.mock("../../../state/ducks/documentRevisions/documentType/selectors.ts", () => ({
  getDocumentTypeOptions: () => ([]),
}));
jest.mock("../../../state/ducks/tableSearch/actions.ts", () => ({
  setSearchCriteria: jest.fn(),
}));
jest.mock("../../../state/ducks/tableSearch/selectors.ts", () => ({
  getTableState: () => ({
    queryDict: { docId: "1" },
    queryData: [],
  }),
}));
jest.mock("../../../state/ducks/auth/selectors.ts", () => ({
  currentUserEmail: () => "test@test.com",
}));
jest.mock("react-router-dom", () => ({
  Link: (props: any) => props.children,
}));

describe("Document revision ListContainer tests", () => {
  const defaultProps: Props = {
    ...getRouteComponentProps(),
  };

  const getWrapper = (props: Partial<Props>= {}) => mount(
    <ListContainer {...defaultProps} {...props}/>,
  );

  it("render ListPresenter", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ListPresenter)).toHaveLength(1);
  });
});
