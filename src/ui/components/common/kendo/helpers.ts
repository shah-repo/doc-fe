import { GridPagerSettings } from '@progress/kendo-react-grid';
import { chain, filter, findIndex, isEmpty } from 'lodash';
import { Translation } from '../../../translations/types';
import { KendoColumn } from './types';

export const orderByLockedState = (
  columnDefinitions: KendoColumn[],
  _groupableFields: string[],
): KendoColumn[] => {
  const sortedColumnDefinitions = chain([...columnDefinitions])
    .orderBy(['locked'], ['desc'])
    .map((column, index) => {
      column.reorderable = !column.locked;
      column.orderIndex = column.locked ? 0 : column.orderIndex ?? index;
      column.disabled = false;
      return column;
    })
    .value();
  const hiddenColumns = filter(sortedColumnDefinitions, { show: false }).length;
  if (hiddenColumns === sortedColumnDefinitions.length - 1) {
    const indexOfObject = findIndex(sortedColumnDefinitions, ['show', true]);
    sortedColumnDefinitions[indexOfObject].disabled = true;
  }
  return sortedColumnDefinitions;
};

/**
 * Entity schema for the group entity. Along with the required field to identify the entity,
 */
/*
const columnSchema = new schema.Entity("columns", {}, { idAttribute: "field" });
const filterentity = new schema.Entity("filter", {}, { idAttribute: "field" });
const group = new schema.Entity("group");
const filters = { filters: [filterentity] };
const groups = { groups: [group] };
const kendoConfigSchema = new schema.Object({ filter: filters, groups });
*/

/**
  * To normalize data, we need to define a schema for the data we want to normalize.
  * @param data
  * @returns [normalizedData, result, normalizedEntities]
  */
/* export const getColumnNormalizedData = (data) => {
  const normalizedData = normalize(data, [columnSchema]);
  return normalizedData;
}; */

/**
  * To denormalize data, we need to define a schema for the data we want to denormalize.
  * And we need to pass the normalized data to denormalize.
  * @param normalizedData - [normalizedData, result, normalizedEntities]
  * @returns [denormalizedData]
  */
/* export const getColumnDenormalizedData = (result, entities) => {
  const denormalizedData = denormalize(result, [columnSchema], entities);
  return denormalizedData;
}; */

/**
   * To normalize data, we need to define a schema for the data we want to normalize.
   * @param data
   * @returns [normalizedData, result, normalizedEntities]
   */
/* export const getFilterNormalizedDData = (data) => {
  const normalizedData = normalize(data, kendoConfigSchema);
  return normalizedData;
}; */

/**
   * To denormalize data, we need to define a schema for the data we want to denormalize.
   * And we need to pass the normalized data to denormalize.
   * @param normalizedData - [normalizedData, result, normalizedEntities]
   * @returns [denormalizedData]
   */
/* export const getFilterDenormalizedDData = (result, entities) => {
  const denormalizedData = denormalize(result,
    kendoConfigSchema, entities);
  return denormalizedData;
}; */

/**
 * To calculate and set column width
 * If it is below 100% then it will be calculated considering the grid width given
 * or else it will be same as column width
 * @param columnWidth
 * @param gridWidth
 * @return [newColumnWidth]
 */
export const setColumnWidth = (columnWidth: number, gridWidth: number): number => {
  if (columnWidth < 100) {
    let width = (gridWidth / 100) * columnWidth;
    if (width <= 200) {
      width = 200;
    }
    return width;
  }
  return columnWidth;
};

/**
 * To hide the column title on mouse while resizing the grid
 */
export const hideColumnTitleOnResize = (): void => {
  const selector = document.querySelector('.k-header.k-drag-clue') as HTMLElement;
  if (!isEmpty(selector)) {
    selector.style.display = 'none';
  }
};

export enum DisplayText {
  ACTIVE,
  INACTIVE,
  SELECT_ITEM,
  HIDE_COLUMN,
  UNLOCK_COLUMN,
  LOCK_COLUMN,
  SELECT_STATE,
  SELECT_TYPE,
  NONE,
  ALL,
  CLEAR,
  OFFICIAL,
  UNOFFICIAL,
  INEDIT,
  SELECT_GROUPS,
  RESEND_SIGNUP_EMAIL,
  RESET_PASSWORD,
  SIGNEDUP,
  FIELD_CONFIG,
  SCHEMA,
  YES,
  NO,
}
export const TranslatedText: { [Key in DisplayText]: Translation } = {
  [DisplayText.ACTIVE]: 'common.active',
  [DisplayText.INACTIVE]: 'common.inactive',
  [DisplayText.SELECT_ITEM]: 'common.select.item',
  [DisplayText.HIDE_COLUMN]: 'common.column.hide',
  [DisplayText.UNLOCK_COLUMN]: 'common.column.unlock',
  [DisplayText.LOCK_COLUMN]: 'common.column.lock',
  [DisplayText.SELECT_STATE]: 'common.select.state',
  [DisplayText.SELECT_TYPE]: 'common.select.type',
  [DisplayText.NONE]: 'fields.select.none',
  [DisplayText.ALL]: 'common.all',
  [DisplayText.CLEAR]: 'common.clear',
  [DisplayText.OFFICIAL]: 'common.official',
  [DisplayText.UNOFFICIAL]: 'common.unofficial',
  [DisplayText.INEDIT]: 'common.inEdit',
  [DisplayText.SELECT_GROUPS]: 'common.select.groups',
  [DisplayText.SIGNEDUP]: 'user.management.signed.up',
  [DisplayText.RESEND_SIGNUP_EMAIL]: 'user.management.resend.signup.email',
  [DisplayText.RESET_PASSWORD]: 'reset.password',
  [DisplayText.FIELD_CONFIG]: 'form.builder.field.config',
  [DisplayText.SCHEMA]: 'common.schema',
  [DisplayText.YES]: 'common.true',
  [DisplayText.NO]: 'common.false',
};

export enum statusClassMapping {
  'Pending Approval'='PENDING_STATUS',
  'In Review'='PENDING_STATUS',
  'Pending Change'='PENDING_STATUS',
  'IN_REVIEW' = 'PENDING_STATUS',
  'Approved'='GREEN_STATUS',
  'Quarantine' = 'PENDING_STATUS',
  'Accepted'='GREEN_STATUS',
  'Released'='GREEN_STATUS',
  'APPROVED' = 'GREEN_STATUS',
  'Obsolete'='GRAY_STATUS',
  'Voided'='GRAY_STATUS',
  'CLOSED' = 'GRAY_STATUS',
  'VOIDED' = 'GRAY_STATUS',
  'Superseded'='GRAY_STATUS',
  'Void'='GRAY_STATUS',
}

export const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: 'numeric',
  pageSizes: [25, 50, 75, 100, 500],
  previousNext: true,
};

export const hideOperatorTooltip = (): void => {
  document.querySelectorAll('.k-dropdown-operator .k-dropdown-wrap')?.forEach((item) => {
    item.setAttribute('title', '');
  });
  setTimeout(() => {
      document.querySelectorAll('.k-master-row.k-alt')?.forEach((item) => {
        item.classList.remove('k-alt');
      });
  });
};
