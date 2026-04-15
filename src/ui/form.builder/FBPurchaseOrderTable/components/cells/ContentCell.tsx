import { kebabCase } from 'lodash';
import { reaction } from 'mobx';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import StyledLink from '../../../../components/common/kendo/StyledLink';
import { CellComponent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import KendoDataGridCell from '../../../../components/KendoDataGrid/KendoDataGridCell';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import FBAutocompleteAsyncState from '../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FBPurchaseOrderItem } from '../../../FBPurchaseOrder/FBPurchaseOrder.types';
import { FB } from '../../../helpers';

const ContentCell: CellComponent<FBPurchaseOrderItem> = ({ dataItem, field, column, children, ...props }) => {
  const value: ReactNode = children ?? (dataItem[field] as ReactNode);
  const dataCy = props['data-cy'] ?? kebabCase(field ?? column?.id ?? '');
  const isPartColumn = field === 'partNumberDocId';
  const { partNumber, partNumberDocumentId, partNumberDocId } = dataItem ?? {};
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {});

  const storedPart = useMemo(() => {
    if (!partNumber || !isPartColumn) return null;

    return FBAutocompleteAsyncStore.getValue<DocumentRevision>(FBAutocompleteAsyncOption.parts, partNumber);
  }, [partNumber]);

  const [latestPartDocId, setLatestPartDocId] = useState<string>(storedPart?.document?.docId ?? partNumberDocId ?? '');

  useEffect(() => {
    if (storedPart?.document?.docId) {
      setLatestPartDocId(`${storedPart.document.docId} - ${storedPart.displayRevision}`);
    }
  }, [storedPart]);

  useEffect(() => {
    if (!partNumber || storedPart || !isPartColumn) return;

    autocompleteAsyncState.fetchAutocompleteOption(partNumber, FBAutocompleteAsyncOption.parts);
  }, [partNumber, storedPart, autocompleteAsyncState]);

  useEffect(() => {
    const disposer = reaction(
      () => autocompleteAsyncState?.autocompleteValueApi?.data,
      (data) => {
        if (!data?.document?.docId) return;

        setLatestPartDocId(`${data.document.docId} - ${data.displayRevision}`);
      },
    );

    return () => disposer();
  }, [autocompleteAsyncState]);
  const displayValue = isPartColumn ? latestPartDocId || translate('common.not.applicable') : value;
  const shouldRenderLink = isPartColumn && !!latestPartDocId && !!partNumber && !!partNumberDocumentId;

  return (
    <KendoDataGridCell {...props} field={field} data-cy={dataCy} dataItem={dataItem}>
      <OverflowTooltip title={displayValue ?? ''} arrow>
        {shouldRenderLink ? (
          <StyledLink
            to={documentVersionPath(partNumber, partNumberDocumentId)}
            onClick={(e) => e.stopPropagation()}
            data-cy="selected-product-or-service-link"
          >
            {latestPartDocId}
          </StyledLink>
        ) : (
          displayValue
        )}
      </OverflowTooltip>
    </KendoDataGridCell>
  );
};

export default ContentCell;
