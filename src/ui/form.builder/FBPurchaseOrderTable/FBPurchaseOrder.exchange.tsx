import React from "react";
import Text from "../../components/Text";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";

type Props = Pick<FBPurchaseOrderTableProps, "calculation">;

const FBPurchaseOrderExchange: React.FunctionComponent<Props> = ({
  calculation,
}) => (
  <div>
    <div>
      <Text
        translation="form.builder.date.of.exchange"
        values={{
          fixerLink: (
            <a href="https://fixer.io" target="_blank" rel="noopener noreferrer">{"fixer.io"}</a>
          ),
          dateOfExchangeRate: calculation?.dateOfExchangeRate,
        }}
      />
    </div>
    <div>
      <Text message={`form.builder.${calculation?.currency}.to.USD`} values={{ rate: calculation?.exchangeRate }} />
    </div>
    <div>
      <Text translation="form.builder.total.in.USD" values={{ total: calculation?.totalInUSD }} />
    </div>
  </div>
);

export default FBPurchaseOrderExchange;
