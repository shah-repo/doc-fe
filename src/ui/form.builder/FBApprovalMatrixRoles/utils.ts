import { State } from '@progress/kendo-data-query';
import { GridDataStateChangeEvent } from '@progress/kendo-react-grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTableCriteria } from '../../../common/utils/selectors';
import { tableSearchActions } from '../../../state/ducks/tableSearch';

interface TableCriteria {
  dataState: State
  setDataState: React.Dispatch<React.SetStateAction<State>>
  dataStateChange: (e: GridDataStateChangeEvent) => State
}

const useTableCriteria = (tableType: string): TableCriteria => {
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(tableType));
  const [dataState, setDataState] = React.useState<State>(tableCriteria?.queryDict?.dataState);

  const dataStateChange = (e: GridDataStateChangeEvent) => {
    const updatedDataState = { ...e.dataState };
    setDataState(updatedDataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState: updatedDataState,
          },
        },
        tableType,
      ),
    );
    return updatedDataState;
  };

  return {
    dataState,
    setDataState,
    dataStateChange,
  };
};

export default useTableCriteria;
