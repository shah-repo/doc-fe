import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  dashboardMyFeedsActions,
} from '../../../state/ducks/dashboard.new/my.feeds';
import {
  trainingActions,
  trainingSelectors,
} from '../../../state/ducks/dashboard.new/training';
import { TRAINING_INITIAL_OFFSET, TRAINING_INITIAL_PAYLOAD, TRAINING_LIMIT } from '../../../state/ducks/dashboard.new/training/constants';
import AsyncGate from '../../components/AsyncGate';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { scrollToBottom } from '../line.items/common/Utils';
import TrainingsLineItemPresenter from './Trainings.presenter';

const TrainingsLineItemsContainer: React.FunctionComponent = () => {
  const [offset, setOffset] = React.useState(TRAINING_INITIAL_OFFSET);
  const [overallLimit, setOverallLimit] = React.useState(TRAINING_LIMIT);
  const loadTrainingList = useActionCreator(trainingActions.loadTrainingList);
  const loadTrainingListAsyncInfo = useSelector(
    trainingSelectors.getLoadTrainingListAsyncInfo
  );
  const dispatch = useDispatch();
  const pinnedOrUnPinnedAsync = useAsync({
    onSuccess: () => {
      setOffset(TRAINING_INITIAL_OFFSET);
      setOverallLimit(TRAINING_LIMIT);
      dispatch(trainingActions.loadTrainingList(TRAINING_INITIAL_PAYLOAD));
    },
  });
  const pinnedLineItem = useActionCreator(dashboardMyFeedsActions.pinnedLineItem
  );
  const unPinnedLineItem = useActionCreator(dashboardMyFeedsActions.unPinnedLineItem
  );
  const pinLineItem = (id: string) => {
    pinnedOrUnPinnedAsync.start(pinnedLineItem, id, pinnedOrUnPinnedAsync);
  };
  const unPinLineItem = (pinnedItemId: string) => {
    pinnedOrUnPinnedAsync.start(unPinnedLineItem, pinnedItemId, pinnedOrUnPinnedAsync);
  };

  const async = useAsync();

  const onLoadMoreData = () => {
    const nextOffset = offset + TRAINING_LIMIT;
    setOffset(nextOffset);
    setOverallLimit(overallLimit + TRAINING_LIMIT);
    const updatedPageSize = {
      offset: nextOffset,
      limit: TRAINING_LIMIT,
    };
    async.start(loadTrainingList, updatedPageSize);
    setTimeout(() => {
      scrollToBottom('#trainingBoxLoadMore');
    }, 2000);
  };

  return (
    <AsyncGate
      asyncAction={loadTrainingList}
      asyncState={loadTrainingListAsyncInfo}
      startActionOnMount={true}
    >
      <TrainingsLineItemPresenter {...{ pinLineItem, unPinLineItem, overallLimit }} onLoadMoreData={onLoadMoreData}/>
    </AsyncGate>
  );
};

export default TrainingsLineItemsContainer;
