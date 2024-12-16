import '@testing-library/jest-dom/extend-expect';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
// eslint-disable-next-line no-undef
jest.mock('./common/utils/iot/iotService');
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: () => 'Mocked React Markdown',
}));
