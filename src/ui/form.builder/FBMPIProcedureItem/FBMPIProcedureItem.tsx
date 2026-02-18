import { Box } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  FBDialog,
  FBMPIProcedureItemProps,
  FBMediaAlbumField,
  FBProcedureItemLocale,
  FBProcedureItemOmitAction,
  FBProcedureItemType,
  FBProvider,
  FBText,
  FBTooltip,
} from '..';
import Colors from '../../layout/theme/utils/colors';
import FBEquipmentTable from '../FBEquipmentTable/components/treelist';
import MaterialsTable from '../FBMaterialsTable/MaterialTable';
import { withFBMPIProcedureItem } from './FBMPIProcedureItem.wrap';

const FBMPIProcedureItem: React.FunctionComponent<FBMPIProcedureItemProps> = ({
  onClick,
  handleRemove,
  handleSelect,
  handleSelectionDelete,
  getItem,
  getLot,
  getProcedureLocale,
  getProcedureValues,
  isDateOverdue,
  mpiProcedureState,
  dialogState,
  isPreview,
  disabled,
  loading,
  type,
  value = [],
  name,
  isSelectVisible,
  defaultValue,
  redlineActive,
  isReleased,
  isDesign,
  isDocumentMPI,
}) => {
  const [isHover, setIsHover] = useState(false);
  const isUnrelatedToMaterialAndEquipment = ![FBProcedureItemType.materials, FBProcedureItemType.equipment].includes(type);
  const isAttachmentType = type === FBProcedureItemType.attachments;

  return (
    <FBProvider {...{ dialogState, mpiProcedureState }}>
      <FBDialog />
      {isAttachmentType && <Box
        bgcolor={Colors.athens_gray}
        color= {Colors.almost_black}
        fontWeight={600}
        fontSize= "12px"
        display="flex"
        lineHeight= "15px"
        height="44px"
        boxShadow= {`0 1px 0 ${Colors.chinese_silver}`}
        borderRadius="3px 3px 0 0"
        border = {`1px solid ${Colors.chinese_silver}`}
      >
        <FBText
          {...{ loading }}
          boxProps={{
            flexGrow: 1,
            display: 'flex',
            p: 1.5,
          }}
          locale={FBProcedureItemLocale[type]}
        />
        {!isPreview && isUnrelatedToMaterialAndEquipment && !FBProcedureItemOmitAction.includes(type) && (
          <Box pt={1.6} pr={2}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
            <FBTooltip title="form.builder.add">
              { isHover
                ? <AddCircleIcon style={{ color: Colors.almost_black, width: '17px', height: '17px' }}
                  data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                  onClick={() => onClick?.()}
                  {...{ disabled }}
                />
                : <AddCircleOutlineOutlinedIcon style={{ color: Colors.font_gray, width: '17px', height: '17px' }}
                  data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                  onClick={() => onClick?.()}
                  {...{ disabled }}
                />
              }
            </FBTooltip>
          </Box>
        )}
      </Box>}
      {!isAttachmentType && (
        <Box color={Colors.almost_black} fontWeight={600} fontSize="12px">
          <FBText {...{ loading }} locale={FBProcedureItemLocale[type]} />
        </Box>
      )}
      {isAttachmentType && (
        <Box data-cy="mediaUploadField" mt={2}>
          <FBMediaAlbumField
            name={`${name}.attachments`}
            isTemplate={true}
            editorProperties={['copyableValue']}
            gutter={false}
            editorConfig={defaultValue}
            autosave={false}
            fieldType="mpiprocedure"
          />
        </Box>
      )}
      {type !== FBProcedureItemType.attachments && !loading && (
        <>
          {type === FBProcedureItemType.materials && (
            <MaterialsTable
              name={name}
              isEnableOnlyLotAddition={isSelectVisible && !redlineActive}
              isActive={!isPreview}
              type={type}
              isDisabled={disabled}
              isDesign={isDesign}
              items={value}
              getItem={getItem}
              handleRemove={handleRemove}
              handleSelectionDelete={handleSelectionDelete}
              isMPIProcedure={isDocumentMPI}
              isPreview={isPreview}
            />
          )}
          {type === FBProcedureItemType.equipment && (
            <FBEquipmentTable
              name={name}
              isDisabled={Boolean(disabled)}
              type={type}
              items={value}
              getItem={getItem}
              handleRemove={handleRemove}
              handleSelectionDelete={handleSelectionDelete}
              isDesign={isDesign}
              isPreview={isPreview}
              isMPIProcedure={isDocumentMPI}
              isEnableActualIdAddition={isSelectVisible && !redlineActive}
            />
          )}
          {type === FBProcedureItemType.serials && (
            <></>
          )}
        </>
      )}
    </FBProvider>
  );
};

export default withFBMPIProcedureItem(FBMPIProcedureItem);
