import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import { get } from 'lodash';
import React from 'react';
import { ISupplierScanResultRev } from '../../interface';
import { useBulkMigration } from '../../useBulkMigration';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  scanId: string
}

export const FieldsUnmatchedCellTemplate: React.FC<Props> = ({ field, scanId, dataItem }) => {
  const classes = styles();
  const { isMapped } = dataItem;
  const {
    rowMapping,
    getPreviewForDocRevRevsTable,
  } = useBulkMigration();

  const updateRow = (updatedRow: ISupplierScanResultRev) => {
    dataItem = updatedRow;
  };

  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <div className={classes.tableCellHiddenOverflow}>
      {isMapped ? JSON.stringify(displayValue)
        : <>{
          rowMapping ? <span>Mapping... </span> : <span>NOT MAPPED
            <TrackChangesIcon onClick={e => getPreviewForDocRevRevsTable(scanId, dataItem, updateRow)} className={classes.cursorPointer} /></span>
        }
        </>
      }
    </div>
  );
};
