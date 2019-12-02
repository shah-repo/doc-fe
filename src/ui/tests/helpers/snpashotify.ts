import { ReactWrapper } from "enzyme";

const snapshotify = (reactWrapper: ReactWrapper) => {
  return reactWrapper.html();
};

export default snapshotify;
