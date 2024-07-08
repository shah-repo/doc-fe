import { shallow } from 'enzyme';
import faker from 'faker';
import React, { JSXElementConstructor, ReactElement } from 'react';
import { DocumentInfo, Props } from '../DocumentInfo';

describe('DocumentInfo tests', () => {
  const defaultProps: Props = {
    numberOfRecords: faker.random.number(),
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <DocumentInfo {...defaultProps} {...props} />,
  );

  it('Renders correctly', () => {
    const wrapper = getWrapper();

    expect(wrapper.find('span').contains(defaultProps.numberOfRecords as unknown as string | ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[])).toBe(true);
  });
});
