import { generatePath } from 'react-router-dom';
import { EQUIPMENT_SPECIFICATION_VERSION_URL } from '../../constants/urls';
import { RouteParams } from './types';

const documentPath = (path: string, routeParams: RouteParams) =>
  generatePath(path, { ...routeParams });

export const documentEditPath = (equipmentSpecificationId: string, documentId: string) =>
  documentPath(EQUIPMENT_SPECIFICATION_VERSION_URL, { equipmentSpecificationId, documentId });

export const documentPreviewPath = (equipmentSpecificationId: string, documentId: string) =>
  documentPath(EQUIPMENT_SPECIFICATION_VERSION_URL, { equipmentSpecificationId, documentId });
