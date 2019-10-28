import { shallow } from "enzyme";
import faker from "faker";
import React from "react";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import { ASYNC_DEFAULT_STATE } from "../../hooks/useAsync";
import getRouteComponentProps from "../../tests/helpers/getRouteComponentProps";
import { ListContainer, Props} from "./container";
import ListPresenter from "./presenter";

describe("ListContainer tests", () => {
  const defaultProps: Props = {
    ...getRouteComponentProps(),
    loadDocumentRevisions: jest.fn(),
    loadAsyncState: ASYNC_DEFAULT_STATE,
    dataProp: [ getDocumentRevision() ],
    currentUserEmail: faker.internet.email(),
    setDocId: jest.fn(),
    documentTypeOptions: [{
        value: faker.lorem.word(),
        text: faker.lorem.word(),
    }],
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ListContainer {...defaultProps} {...props}/>,
  );

  it("Set props correctly", () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ListPresenter).prop("dataProp")).toEqual(defaultProps.dataProp);
  });
});
