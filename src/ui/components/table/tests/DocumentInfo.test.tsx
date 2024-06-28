import { shallow } from 'enzyme';
import faker from 'faker';
import React from 'react';
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(wrapper.find('span').contains(defaultProps.numberOfRecords)).toBe(true);
  });
});
