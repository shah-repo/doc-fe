import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler } from 'react';
import WhereUsedDialog, { WhereUsedType } from '../../../../../../components/whereUsed/WhereUsedDialog';
import useDialog from '../../../../../../hooks/useDialog';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const WhereUsedCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem } = props;

  const { lotDocRevId, whereUsedView } = dataItem;
  const isWhereUsedTreeExist = (whereUsedView ?? []).length > 1;

  const whereUsedDialog = useDialog();
  const openWhereUsedDialog: MouseEventHandler = (e) => {
    isWhereUsedTreeExist && whereUsedDialog.open();
    e.stopPropagation();
  };
  const closeWhereUsedDialog: MouseEventHandler = (e) => {
    whereUsedDialog.close();
    e.stopPropagation();
  };

  return (
    <>
      <FontAwesomeIcon icon={isWhereUsedTreeExist ? solid('circle') : regular('circle')} data-cy="view-where-used"
        onClick={openWhereUsedDialog} className={classes.dot} />
      {
        whereUsedDialog.isOpen
        && <WhereUsedDialog
          revId={lotDocRevId}
          whereUsedDialog={whereUsedDialog}
          closeDialog = {closeWhereUsedDialog}
          type={WhereUsedType.LOT}
        />
      }
    </>

  );
};
