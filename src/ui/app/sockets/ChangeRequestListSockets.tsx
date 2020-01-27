import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { getTableState } from "../../../common/utils/selectors";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { CR_TABLE_NAME } from "../../change.request/list/container";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const ChangeRequestListSockets: React.FunctionComponent = () => {
  const crTableState = useSelector(getTableState(CR_TABLE_NAME));
  const dispatch = useDispatch();
  const iotService = IotService.getInstance();
  const async = useAsync({
    onSuccess: (data: any = []) => {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...crTableState,
            queryData: [
              data[0],
              ...crTableState.queryData,
            ],
          },
          CR_TABLE_NAME,
        ),
      );
    },
  });
  const loadAction = useActionCreator(changeRequestsActions.loadListWithCallback);
  const subscribe = () => {
    iotService.subscribeToTopic(`+/change_requests/+crId/created`, loadData);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/change_requests/+crId/created`);
  };
  const loadData = (msg: string, params: any) => {
    const { crId } = params;
    async.start(loadAction, { crId }, async);
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default ChangeRequestListSockets;
