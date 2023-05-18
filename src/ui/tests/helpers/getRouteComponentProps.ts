import { RouteComponentProps } from 'react-router-dom';

const getRouteComponentProps = <P = {}>(params?: P): RouteComponentProps<P> => ({
  match: {
    isExact: true,
    params: params || {} as P,
    path: '',
    url: '',
  },
  location: {
    pathname: 'target/',
    search: '',
    state: '',
    hash: '',
  },
  history: {
    length: 2,
    action: 'POP',
    location: {
      pathname: '/',
      search: '',
      state: '',
      hash: '',
    },
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    block: jest.fn(),
    createHref: jest.fn(),
    listen: jest.fn(),
  },
  staticContext: {},
});

export default getRouteComponentProps;
