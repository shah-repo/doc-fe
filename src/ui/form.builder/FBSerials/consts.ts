export const DEFAULT_LOT_ID = '_unset_';

export const PART_SERIALIZATION_KEY = 'has-serialization';
export const PART_SERIALIZATION_TYPE_KEY = 'select-serialization';

export const LOT_PART_SELECT_KEY = 'lot_part';
export const LOT_QUANTITY_SELECT_KEY = 'lot_quantity';

export const LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS = [
  LOT_PART_SELECT_KEY,
  LOT_QUANTITY_SELECT_KEY,
];

export const HAS_SERIALIZATION_VALUES = ['Yes'];
export const SERIALIZATION_MANUAL_VALUES = ['manual', 'Select Provided Serialization'];
export const SERIALIZATION_SYSTEM_GENERATED_VALUES = ['system-generated', 'In-house Generated Serialization'];

export const SERIAL_VALIDATION_DEBOUNCE_MS = 500;
