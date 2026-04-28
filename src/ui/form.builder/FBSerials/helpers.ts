import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';

const PART_SERIALIZATION_KEY = 'has-serialization';
const PART_SERIALIZATION_TYPE_KEY = 'select-serialization';

export const LOT_PART_SELECT_KEY = 'lot_part';
export const LOT_QUANTITY_SELECT_KEY = 'lot_quantity';
const LOT_SERIAL_NUMBERS_FIELD = 'lot-serial-numbers';

export const LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS = [
  LOT_PART_SELECT_KEY,
  LOT_QUANTITY_SELECT_KEY,
  LOT_SERIAL_NUMBERS_FIELD,
];

const HAS_SERIALIZATION_VALUES = ['Yes'];
const SERIALIZATION_MANUAL_VALUES = ['manual', 'Select Provided Serialization'];
const SERIALIZATION_SYSTEM_GENERATED_VALUES = ['system-generated', 'In-house Generated Serialization'];

const isSerializationManual = (serializationType: string): boolean => {
  return SERIALIZATION_MANUAL_VALUES.includes(serializationType);
};

const isSerializationSystemGenerated = (serializationType: string): boolean => {
  return SERIALIZATION_SYSTEM_GENERATED_VALUES.includes(serializationType);
};

export const isPartSerializationManual = (part?: DocumentRevision): boolean => {
  const serializationType = String(part?.formInput?.[PART_SERIALIZATION_TYPE_KEY]);
  return isSerializationManual(serializationType);
};

export const isPartSerializationSystemGenerated = (part?: DocumentRevision): boolean => {
  const serializationType = String(part?.formInput?.[PART_SERIALIZATION_TYPE_KEY]);
  return isSerializationSystemGenerated(serializationType);
};

export const isPartHasSerialization = (part?: DocumentRevision): boolean => {
  const hasSerialization = String(part?.formInput?.[PART_SERIALIZATION_KEY]);
  return HAS_SERIALIZATION_VALUES.includes(hasSerialization);
};
