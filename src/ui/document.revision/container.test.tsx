import { shallow } from 'enzyme';
import React from 'react';
import { match, Route } from 'react-router-dom';
import { getDocumentRevision } from '../../state/ducks/documentRevisions/tests/factories';
import {
  DOCUMENT_REVISION_DETAILS_URL,
  DOCUMENT_REVISION_NEW_VERSION_URL,
  DOCUMENT_REVISION_VERSION_URL,
} from '../constants/urls';
import { ASYNC_DEFAULT_STATE } from '../hooks/useAsync';
import getRouteComponentProps from '../tests/helpers/getRouteComponentProps';
import { Container, Props } from './container';
import { RouteParams } from './utils/types';

describe('Container tests', () => {
  const defaultProps: Props = {
    ...getRouteComponentProps(),
    match: getRouteComponentProps().match as match<RouteParams>,
    dataProp: getDocumentRevision(),
    load: jest.fn(),
    loadAsyncState: ASYNC_DEFAULT_STATE,
  };

  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <Container {...defaultProps} {...props} />,
  );

  it('Set path props correctly', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(Route).at(0).prop('path')).toEqual(DOCUMENT_REVISION_VERSION_URL);
    expect(wrapper.find(Route).at(1).prop('path')).toEqual(DOCUMENT_REVISION_DETAILS_URL);
    expect(wrapper.find(Route).at(2).prop('path')).toEqual(DOCUMENT_REVISION_NEW_VERSION_URL);
  });
});
