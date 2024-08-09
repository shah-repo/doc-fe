import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FBProcedureItemProps, FBText } from '..';
import Colors from '../../layout/theme/utils/colors';
import { withFBProcedureItemDetails } from './FBProcedureItemDetails.wrap';
const FBProcedureItemDetails: React.FunctionComponent<FBProcedureItemProps> = ({
  getItem,
  getLot,
  item,
  type,
  lotDocId,
}) => {
  return (
    <FBText
      locale={`form.builder.procedure.${type}.title`}
      values={{
        title: getItem?.(item?.title),
        lot: lotDocId,
        quantity: item?.quantity || 'form.builder.none',
        unit: item?.unit,
      }}
      boxProps={{
        color: Colors.black,
        flexGrow: 1,
      }}
    />
  );
};
export default withFBProcedureItemDetails(FBProcedureItemDetails);
