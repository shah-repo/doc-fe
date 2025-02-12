import { shallow } from 'enzyme';
import React from 'react';
import { Attachment } from '../../../state/ducks/attachments/types';
import { Async } from '../../hooks/useAsync';
import { DownloadButtonContainer, DownloadButtonContainerProps } from './DownloadButton.container';
import DownloadButtonPresenter from './DownloadButton.presenter';
import { LINE_TYPES } from '../../../state/ducks/attachments/constants';

describe('DownloadButtonContainer tests', () => {
  const attachment: Attachment = {
    id: 'DASfjsak',
    name: 'Test',
    type: 'txt',
    s3link: '',
    isLoading: false,
    fileSizeS3Link: 1,
    fileSizeS3LinkCleanCopy: 1,
    hasWatermarks: false,
    lineType: LINE_TYPES.CLEAN_COPY,
  };
  const defaultProps: DownloadButtonContainerProps = {
    attachment,
    download: jest.fn(),
  };

  const getWrapper = (props: Partial<DownloadButtonContainerProps>) => shallow(
    <DownloadButtonContainer {...defaultProps} {...props} />,
  );

  const { open } = window;

  beforeAll(() => {
    Object.defineProperty(window, 'open', { configurable: true });
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = open;
  });

  it('calls onClick and opens document on success', () => {
    const download = jest.fn();
    const wrapper = getWrapper({ download });
    const presenter = wrapper.find(DownloadButtonPresenter);

    (presenter.prop('onClick') as () => void)();

    expect(download).toHaveBeenCalledTimes(1);
    const parameters = download.mock.calls[0];

    expect(parameters[0]).toEqual(attachment);
    expect(parameters[1]).toBeDefined();

    (parameters[1] as Async).successHandler.execute({ url: '123' });

    expect(window.open).toHaveBeenCalledWith('123', '_parent');
  });
});
