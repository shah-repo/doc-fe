import MockAdapter from "axios-mock-adapter";
import faker from "faker";
import apiInstance from "../../../state/apiClient";
import { ApplicationState } from "../../../state/reducers";
import makeMountRender from "../../tests/helpers/makeMountRender";
import { reduxify } from "../../tests/helpers/reduxify";
import snapshotify from "../../tests/helpers/snpashotify";
import ticks from "../../tests/helpers/ticks";
import ListContainer, { Props } from "./container";

const apiMock = new MockAdapter(apiInstance);

jest.mock("../../components/Text");

const mockResponse = [
  {
    createdAt: "2019-11-28T11:15:35.917Z",
    updatedAt: "2019-11-28T11:15:59.964Z",
    id: "8d785119-e164-4e00-940b-0e049bb4227d",
    description: "<p>New Form Supplier Survey CR</p>",
    title: "New Form Supplier Survey CR",
    state: "APPROVED",
    effectiveDate: "2019-11-29T08:00:00.000Z",
    crId: "CR00023",
    closedAt: null,
    owner: {
      createdAt: "2019-10-28T08:44:31.039Z",
      updatedAt: "2019-10-28T08:47:49.877Z",
      id: "2ce41b2b-5b27-47e6-8e8f-57b941923f9e",
      active: true,
      user: {
        createdAt: "2019-11-05T13:00:19.508Z",
        updatedAt: "2019-11-05T13:00:19.508Z",
        id: "da6c46af-29c2-4a01-9c80-ee48d7590199",
        email: "maja.ivezic+1@codecons.com",
        name: "Maja",
        permissions: null,
      },
    },
  },
  {
    createdAt: "2019-11-21T07:46:56.378Z",
    updatedAt: "2019-11-21T07:47:41.765Z",
    id: "e6280257-8d30-47ec-8984-d2f46b0535cb",
    description: "<p>Document Form CR</p>",
    title: "Document Form CR",
    state: "CLOSED",
    effectiveDate: "2019-11-22T08:00:00.000Z",
    crId: "CR00022",
    closedAt: "2019-11-21T07:47:41.761Z",
    owner: {
      createdAt: "2019-10-28T08:44:31.039Z",
      updatedAt: "2019-10-28T08:47:49.877Z",
      id: "2ce41b2b-5b27-47e6-8e8f-57b941923f9e",
      active: true,
      user: {
        createdAt: "2019-11-05T13:00:19.508Z",
        updatedAt: "2019-11-05T13:00:19.508Z",
        id: "da6c46af-29c2-4a01-9c80-ee48d7590199",
        email: "maja.ivezic+1@codecons.com",
        name: "Maja",
        permissions: null,
      },
    },
  },
];
describe("Change request list container tests", () => {
  const defaultProps: Props = {
      currentUserEmail: faker.internet.email(),
  } as unknown as Props;
  const state: Partial<ApplicationState> = {
    tableSearch: {
      byTableName: {
        changeRequests: {
          queryData: [],
          queryDict: {},
          apiError: "",
          scrollToIndex: 0,
        },
      },
    },
  };
  const url = "/change_requests";

  beforeEach(() => {
    apiMock.onGet(url).reply(200, mockResponse);
  });

  afterEach(() => {
    apiMock.reset();
  });

  it("list is empty on mount", () => {
    const wrapper = makeMountRender(reduxify<Props>(ListContainer, defaultProps, state))();

    expect(snapshotify(wrapper)).toMatchSnapshot();
  });

  it("has 2 items after mount and initial api call", (done) => {
    const wrapper = makeMountRender(reduxify<Props>(ListContainer, defaultProps, state))();

    ticks([
      () => {
        expect(snapshotify(wrapper)).toMatchSnapshot();
        done();
      },
    ]);
  });

  it("it has 1 item after search by title", (done) => {
    apiMock.onGet(url , { params: { title: "new form" } }).reply(200, mockResponse.slice(1));
    const wrapper = makeMountRender(reduxify<Props>(ListContainer, defaultProps, state))();
    const titleInput = wrapper.find("[name='title']").hostNodes().at(0);
    titleInput.simulate("change", { target: { value: "New Form" } });

    ticks([
      () => {
        expect(snapshotify(wrapper)).toMatchSnapshot();
        done();
      },
    ]);
  });
});
