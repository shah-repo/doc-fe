import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { DocumentTypeCell } from './components/DocumentTypeCell';
import { RestrictionSelectionCell } from './components/RestrictionSelectionCell';
import { EditableDocumentTypeRestriction, OptionType } from './types';

export const buildSchema: SchemaBuilder<EditableDocumentTypeRestriction> = ({
  onEdit,
  onDelete,
  companyEmployees,
  companyGroups,
  documentTypeList,
  onDiscard,
  onConfirm,
}) => {
  return [
    {
      id: 'documentTypeName',
      field: 'documentTypeName',
      title: 'administration.general.settings.creation.restrictions.document.type',
      template: (props) => (
        <DocumentTypeCell {...props} dataOptions={documentTypeList as OptionType[]} />
      ),
    },
    {
      id: 'restrictedToUsers',
      field: 'restrictedToUsers',
      title: 'administration.general.settings.creation.restrictions.restricted.to.users',
      template: (props) => (
        <RestrictionSelectionCell
          {...props}
          dataOptions={companyEmployees as OptionType[]}
        />
      ),
    },
    {
      id: 'restrictedToGroups',
      field: 'restrictedToGroups',
      title: 'administration.general.settings.creation.restrictions.restricted.to.groups',
      template: (props) => (
        <RestrictionSelectionCell
          {...props}
          dataOptions={companyGroups as OptionType[]}
        />
      ),
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      width: 75,
      filterable: false,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          isActive={true}
          onEdit={onEdit}
          onDelete={onDelete}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
        />
      ),
    },
  ];
};
