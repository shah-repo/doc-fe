import { SortDescriptor, State } from '@progress/kendo-data-query';
import { SerialNumber } from '../FBSerials/types';
import { SERIAL_NUMBER_FIELD } from './const';
import { SerialNumberSortDescriptor } from './types';

const serialNumberCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export const getSharedSerialNumberPart = (serialNumbers: SerialNumber[]): string => {
  const serialNumberValues = serialNumbers.map(({ serialNumber }) => serialNumber).filter(Boolean);
  const [firstSerialNumber] = serialNumberValues;

  if (!firstSerialNumber || serialNumberValues.length < 2) {
    return '';
  }

  return serialNumberValues.reduce((sharedPart, serialNumber) => {
    let index = 0;

    while (index < sharedPart.length && sharedPart[index] === serialNumber[index]) {
      index++;
    }

    return sharedPart.slice(0, index);
  }, firstSerialNumber);
};

const getSortableSerialNumber = (serialNumber = '', sharedPart = ''): string => (
  sharedPart && serialNumber.startsWith(sharedPart) ? serialNumber.slice(sharedPart.length) : serialNumber
);

export const compareSerialNumbers = (
  firstSerialNumber = '',
  secondSerialNumber = '',
  sharedPart = '',
  direction: SortDescriptor['dir'] = 'asc',
): number => {
  const result = serialNumberCollator.compare(
    getSortableSerialNumber(firstSerialNumber, sharedPart),
    getSortableSerialNumber(secondSerialNumber, sharedPart),
  );

  return direction === 'desc' ? -result : result;
};

export const getSerialNumberSort = (state: State): SerialNumberSortDescriptor | undefined => (
  (state.sort as SerialNumberSortDescriptor[] | undefined)?.find(({ field, dir }) => field === SERIAL_NUMBER_FIELD && dir)
);

export const getStateWithoutSerialNumberSort = (state: State): State => ({
  ...state,
  sort: state.sort?.filter(({ field }) => field !== SERIAL_NUMBER_FIELD),
});
