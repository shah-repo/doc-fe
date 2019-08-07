import React from "react";
import { PendingAction } from "../../state/ducks/dashboard";
import Text from "../components/Text";

interface OwnProps {
  pendingAction: PendingAction;
}

type Props = OwnProps;

export const PendingActionPresenter: React.FunctionComponent<Props> = ({
  pendingAction
}) => {
  console.log(pendingAction);
  return (
    <div>
      <span
        style={{
          color: 'red',
        }}
      >{`CRID: ${pendingAction.changeReq.crId} `}</span>
      <span>{`from ${pendingAction.changeReq.owner.name} `}</span>
      <Text message={`dashboard.type.${pendingAction.type}`} />
    </div>
  );
};

export default PendingActionPresenter;
