import React from 'react';
import { useSelector } from 'react-redux';
import {
  dashboardRecentsActions,
  dashboardRecentsSelectors,
} from '../../../state/ducks/dashboard.new/recents';
import useActionCreator from '../../hooks/useActionCreator';
import RecentsPresenter from './Recents.presenter';

const RecentsContainer: React.FunctionComponent<{}> = () => {
  const loadRecents = useActionCreator(dashboardRecentsActions.loadRecentsList);
  const loadRecentsListAsyncState = useSelector(
    dashboardRecentsSelectors.getLoadRecentsListAsyncInfo,
  );
  const recents = useSelector(dashboardRecentsSelectors.recentsList);
  return (
    <RecentsPresenter
      {...{
        loadRecents,
        loadRecentsListAsyncState,
        recents,
      }}
    />
  );
};

export default RecentsContainer;
