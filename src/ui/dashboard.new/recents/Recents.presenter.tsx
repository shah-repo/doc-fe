import { List } from '@material-ui/core';
import React from 'react';
import { ActionCreator } from 'redux';
import { getHumanizedFormat } from '../../../common/utils/date';
import { RecentItems, RecentTypes } from '../../../state/ducks/dashboard.new/recents/types';
import { ApiAction, AsyncState } from '../../../state/types';
import AsyncGate from '../../components/AsyncGate';
import Text from '../../components/Text';
import RecentsItem from './Recents.item';

interface Props {
  loadRecents: ActionCreator<ApiAction<RecentItems[], any>>
  loadRecentsListAsyncState: AsyncState
  recents: RecentItems[]
}

const RecentsPresenter: React.FC<Props> = ({
  loadRecents,
  loadRecentsListAsyncState,
  recents,
}) => {
  const renderItems = () => (
    <List>
      {recents.map((data, index) => {
        switch (data.itemType) {
          case RecentTypes.DOCUMENT:
          case RecentTypes.CHANGE_REQUEST:
            return (
              <RecentsItem
                key={data.itemId}
                itemId={data.itemId}
                docId={data.docId}
                itemType={data.itemType}
                docTypeGroup={data.docTypeGroup}
                docRevId={data.docRevId}
                docTitle={data.docTitle}
                accessedAt={getHumanizedFormat(data.accessedAt)}
              />
            );
          default:
            return <Text key={index} translation="common.undefined" />;
        }
      })}
    </List>
  );

  return (
    <AsyncGate
      asyncAction={loadRecents}
      asyncState={loadRecentsListAsyncState}
      startActionOnMount={true}
    >
      {renderItems()}
    </AsyncGate>
  );
};
export default RecentsPresenter;
