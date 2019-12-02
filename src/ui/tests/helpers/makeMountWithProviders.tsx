import { mount } from "enzyme";
import * as React from "react";

const makeMountRenderWithProvider = <P extends any>(
  Component: React.FunctionComponent<P>,
  defaultProps: P = {} as P,
) => {
  return (customProps: Partial<P> = {}) => {
    const props = {
      ...defaultProps,
      ...customProps,
    };

    return mount(<Component {...props} />);
  };
};

export default makeMountRenderWithProvider;
