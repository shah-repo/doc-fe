import { CircularProgress, IconButton } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import { shallow } from 'enzyme';
import React from 'react';
import DownloadButtonPresenter, { DownloadButtonPresenterProps } from './DownloadButton.presenter';

describe('DownloadButtonPresenter tests', () => {
  const defaultProps: DownloadButtonPresenterProps = {
    isLoading: false,
    onClick: jest.fn(),
  };

  const getWrapper = (props: Partial<DownloadButtonPresenterProps>) => shallow(
    <DownloadButtonPresenter {...defaultProps} {...props} />,
  );

  it('displays CloudDownload and enables button if not loading', () => {
    const wrapper = getWrapper({ isLoading: false });
    expect(wrapper.find(IconButton).prop('disabled')).toBe(false);
    expect(wrapper.find(CloudDownload)).toHaveLength(1);
  });

  it('displays CircularProgress and disables button if loading', () => {
    const wrapper = getWrapper({ isLoading: true });
    expect(wrapper.find(IconButton).prop('disabled')).toBe(true);
    expect(wrapper.find(CircularProgress)).toHaveLength(1);
  });
});
