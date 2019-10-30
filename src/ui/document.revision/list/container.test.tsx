import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import getRouteComponentProps from "../../tests/helpers/getRouteComponentProps";
import { ListContainer, Props} from "./container";
import { ListPresenter } from "./presenter";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: () => ({
    queryDict: { docId: "1" },
  }),
}));

describe("ListContainer tests", () => {
  const defaultProps: Props = {
    ...getRouteComponentProps(),
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ListContainer {...defaultProps} {...props}/>,
  );

  it("render ListPresenter", () => {
    const wrapper = getWrapper();
    expect(wrapper.dive().find(ListPresenter)).toHaveLength(1);
  });
});
