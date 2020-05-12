import React from "react";
import { FBPurchaseOrderTableProps } from ".";
import Text from "../../components/Text";

type Props = Pick<FBPurchaseOrderTableProps, "calculation">;

const FBPurchaseOrderExchange: React.FunctionComponent<Props> = ({
  calculation,
}) => (
  <div>
    <div>
      <Text message={`form.builder.${calculation?.currency}.to.USD`} values={{ rate: calculation?.exchangeRate }} />
    </div>
    <div>
      <Text translation="form.builder.total.in.USD" values={{ total: calculation?.totalInUSD }} />
    </div>
  </div>
);

export default FBPurchaseOrderExchange;
