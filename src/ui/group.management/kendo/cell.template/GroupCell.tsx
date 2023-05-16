/* eslint-disable react-hooks/exhaustive-deps */
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import React from 'react';
import { useIntl } from 'react-intl';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import Tooltip from '../../../components/common/kendo/Tooltip';

interface GroupCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: React.CSSProperties;
  className?: string;
  columnIndex?: number;
  setOfficial: ((props: boolean) => void);
  isOfficial: boolean;
  field?: string;
}

export const GroupCell = ({
  dataItem,
  setOfficial,
  isOfficial,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  field,
}: GroupCellProps) => {
  const intl = useIntl();
  const groupData = dataItem[field || ''];
  const localizedData = [
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] }),
      value: intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] }),
    },
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.UNOFFICIAL] }),
      value: intl.formatMessage({ id: TranslatedText[DisplayText.UNOFFICIAL] }),
    },
  ];
  const updateGroupField = ({ target }: DropDownListChangeEvent) => {
    const Selectedvalue = target?.value;
    dataItem.groupType = Selectedvalue.value;
    dataItem.isOfficial = Selectedvalue.value === intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] });
    setOfficial(dataItem.isOfficial);
  };
  const valueSelected = localizedData.find((e) => {
    const groupType = isOfficial
      ? intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] })
      : intl.formatMessage({ id: TranslatedText[DisplayText.UNOFFICIAL] });
    return e.value === groupType;
  });

  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit ? (
        <DropDownList
          onChange={updateGroupField}
          data={localizedData}
          textField="text"
          dataItemKey="value"
          value={valueSelected}
        />
      ) : (
        <Tooltip data={groupData} />
      )}
    </td>
  );
};
