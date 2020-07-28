import React from "react";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";

interface OwnProps {
  label?: Translation;
  value: string | number | JSX.Element;
  dataCy?: string;
}

export type Props = OwnProps;

export const SummaryInfo: React.FunctionComponent<Props> = ({
  label, value, dataCy
}) => (
    <div data-cy={dataCy}>
      {label &&
        <>
          <Text translation={label} />:{" "}
        </>
      }
      {value}
    </div>
  );

export default SummaryInfo;
