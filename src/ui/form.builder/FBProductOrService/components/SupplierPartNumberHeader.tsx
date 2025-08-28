import { Tooltip } from '@material-ui/core';
import { GridHeaderCellProps } from '@progress/kendo-react-grid';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';

interface SupplierPartNumberHeaderProps extends GridHeaderCellProps {
  title?: string
  content?: string
}

export const SupplierPartNumberHeader: React.FC<SupplierPartNumberHeaderProps> = ({
  field,
  title,
  content,
}) => {
  const translatedTitle = translate(title ?? 'form.builder.supplier.product.or.service.grid.heading.supplier.part.number');
  const translatedContent = translate(content ?? title ?? 'form.builder.supplier.product.or.service.grid.heading.supplier.part.number');

  return (
    <Tooltip title={translatedTitle} placement="top-start" arrow>
      <span className="k-cell-inner">
        <span className="k-link">
          <span className="k-column-title" data-cy={`header-cell-${kebabCase(field)}`}>
            {translatedContent}
          </span>
        </span>
      </span>
    </Tooltip>
  );
};
