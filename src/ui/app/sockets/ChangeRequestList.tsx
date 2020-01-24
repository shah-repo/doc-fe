import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { getTableState } from "../../../common/utils/selectors";
import { ChangeRequestStatus } from "../../../state/ducks/changeRequest";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import useDidMqttConnect from "../../hooks/useDidMqttConnect";

const ChangeRequestListSockets: React.FunctionComponent = () => {
  /*
  const notify = (msg: string) => {
    const message = JSON.parse(msg).data.message;
    toast(<ToastMessage message={message} />, {
      className: css({
        background: "#eee !important",
        color: "#333 !important",
        borderRadius: "10px !important",
        boxShadow: "0 1px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 15px 0 rgba(0, 0, 0, 0.2) !important",
      }),
    },
    );
  };
  */
  const CR_TABLE_NAME = "changeRequests";
  const crTableState = useSelector(getTableState(CR_TABLE_NAME));
  const dispatch = useDispatch();
  const didMqttConnect = useDidMqttConnect();
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(`+/change_requests/+/created`, loadData);
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`+/change_requests/+/created`);
  };
  const loadData = () => {
    dispatch(tableSearchActions.setSearchCriteria(
      {
        ...crTableState,
        queryDict: {
          state: ChangeRequestStatus.Draft,
        },
      },
      CR_TABLE_NAME,
    ),
  );
  };
  useEffect(() => {
    subscribe();
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (didMqttConnect) {
      subscribe();
    }
  }, [didMqttConnect]);

  return null;
};

export default ChangeRequestListSockets;
