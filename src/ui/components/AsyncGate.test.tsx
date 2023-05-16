import { Button, LinearProgress } from '@material-ui/core';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { AsyncStatus } from '../../state/types';
import AsyncGate, { AsyncGateProps } from './AsyncGate';

jest.mock('./Text', () => () => null);

describe('AsyncGate component unit tests', () => {
  const TestComponent = () => <div>TEST</div>;

  const defaultProps: AsyncGateProps = {
    asyncState: {
      status: AsyncStatus.Idle,
      message: '',
    },
  };

  const getProps = (props: Partial<AsyncGateProps>): AsyncGateProps => ({
    ...defaultProps,
    ...props,
  });

  const getWrapper = (props: AsyncGateProps): ReactWrapper => mount((
    <AsyncGate {...props}>
      <TestComponent />
    </AsyncGate>
  ));

  it('does not call asyncAction on start by default', () => {
    const asyncAction = jest.fn();

    act(() => {
      getWrapper(getProps({ asyncAction }));
    });

    expect(asyncAction).not.toHaveBeenCalled();
  });

  it('calls asyncAction on start if defined', () => {
    const asyncAction = jest.fn();
    const startActionOnMount = true;

    act(() => {
      getWrapper(getProps({ asyncAction, startActionOnMount }));
    });

    expect(asyncAction).toHaveBeenCalled();
  });

  it('displays children when async action is a success', () => {
    const wrapper: ReactWrapper = getWrapper(getProps({
      asyncState: {
        status: AsyncStatus.Success,
        message: '',
      },
    }));

    expect(wrapper.find(TestComponent)).toHaveLength(1);
  });

  it('displays error message when async action is a failure', () => {
    const message = 'TEST ERROR MESSAGE';
    const wrapper: ReactWrapper = getWrapper(getProps({
      asyncState: {
        status: AsyncStatus.Error,
        message,
      },
    }));

    expect(wrapper.text()).toContain(message);
  });

  it('does not render button if asyncAction is not defined', () => {
    const wrapper: ReactWrapper = getWrapper(getProps({
      asyncState: {
        status: AsyncStatus.Error,
        message: 'ERR',
      },
    }));

    expect(wrapper.find(Button)).toHaveLength(0);
  });

  it('calls async action on error button click', () => {
    const asyncAction = jest.fn();
    const wrapper: ReactWrapper = getWrapper(getProps({
      asyncState: {
        status: AsyncStatus.Error,
        message: 'TEST ERROR MESSAGE',
      },
      asyncAction,
    }));

    const button = wrapper.find(Button).first();
    expect(button).toBeDefined();

    button.simulate('click');
    expect(asyncAction).toHaveBeenCalled();
  });

  it('displays LinearProgress when async action is active', () => {
    const wrapper: ReactWrapper = getWrapper(getProps({
      asyncState: {
        status: AsyncStatus.Active,
        message: '',
      },
    }));

    expect(wrapper.find(LinearProgress)).toHaveLength(1);
  });
});
