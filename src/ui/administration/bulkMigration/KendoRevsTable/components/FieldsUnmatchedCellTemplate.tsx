import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ISupplierScanResultRev } from '../../interface';
import { useBulkMigration } from '../../useBulkMigration';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

interface Props extends CustomTemplateProps {
  scanId: string
}

export const FieldsUnmatchedCellTemplate: React.FC<Props> = ({ field, scanId, dataItem }) => {
  const classes = useStyles();
  const { isMapped } = dataItem;
  const { rowMapping, getPreviewForDocRevRevsTable } = useBulkMigration();

  const updateRow = (updatedRow: ISupplierScanResultRev) => {
    dataItem = updatedRow;
  };

  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER);

  return (
    <>
      {isMapped ? (
        JSON.stringify(displayValue)
      ) : (
        <Box className={classes.fieldsMappingContainer} >
          {translate(
            rowMapping
              ? 'administration.bulk.migration.rev.grid.cell.mapping'
              : 'administration.bulk.migration.comparison.grid.cell.notMapped',
          )}
          <FontAwesomeIcon onClick={() => getPreviewForDocRevRevsTable(scanId, dataItem, updateRow)} className={classes.fieldsMappingIcon} icon={solid('bullseye')} />
        </Box>
      )}
    </>
  );
};
