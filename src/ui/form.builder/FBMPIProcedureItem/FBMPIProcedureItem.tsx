import { Box, Collapse, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
import FBEquipmentTable from '../FBEquipmentTable/components/treelist';
import MaterialsTable from '../FBMaterialsTable/MaterialTable';
import FBMPIProcedureItemSerialsTable from '../FBMPIProcedureItemSerialsTable';
import useStyles from './FBMPIProcedureItem.styles';
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
  stepIndex,
  value = [],
  name,
  isSelectVisible,
  defaultValue,
  redlineActive,
  isReleased,
  isDesign,
  isDocumentMPI,
}) => {
  const classes = useStyles();
  const [isHover, setIsHover] = useState(false);
  const isUnrelatedToMaterialAndEquipment = ![FBProcedureItemType.materials, FBProcedureItemType.equipment].includes(type);
  const isAttachmentType = type === FBProcedureItemType.attachments;
  const hasItems = !isPreview || value.length > 0;
  const attachmentsLength = mpiProcedureState?.value?.attachments?.length ?? 0;
  const hasAttachments = attachmentsLength > 0;
  const showAttachments = isAttachmentType && (!isPreview || hasAttachments);
  const [isAttachmentExpanded, setIsAttachmentExpanded] = useState(hasAttachments);

  return (
    <FBProvider {...{ dialogState, mpiProcedureState }}>
      <FBDialog />
      {showAttachments && <Box className={classes.attachmentHeader}>
        <FBText
          {...{ loading }}
          boxProps={{
            flexGrow: 1,
            display: 'flex',
            p: 1.5,
          }}
          locale={FBProcedureItemLocale[type]}
        />
        <IconButton size="small" className={classes.iconButton} onClick={() => setIsAttachmentExpanded(prev => !prev)}>
          {isAttachmentExpanded ? <ExpandLessIcon className={classes.expandIcon} /> : <ExpandMoreIcon className={classes.expandIcon} />}
        </IconButton>
        {!isPreview && isUnrelatedToMaterialAndEquipment && !FBProcedureItemOmitAction.includes(type) && (
          <Box pt={1.6} pr={2}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
            <FBTooltip title="form.builder.add">
              { isHover
                ? <AddCircleIcon className={classes.addIcon}
                  data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                  onClick={() => onClick?.()}
                  {...{ disabled }}
                />
                : <AddCircleOutlineOutlinedIcon className={classes.addIconOutline}
                  data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                  onClick={() => onClick?.()}
                  {...{ disabled }}
                />
              }
            </FBTooltip>
          </Box>
        )}
      </Box>}
      {!FBProcedureItemOmitAction.includes(type) && (
        <Box className={classes.typeLabel}>
          <FBText {...{ loading }} locale={FBProcedureItemLocale[type]} />
        </Box>
      )}
      {showAttachments && (
        <Collapse in={isAttachmentExpanded}>
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
        </Collapse>
      )}
      {type !== FBProcedureItemType.attachments && !loading && (
        <>
          {type === FBProcedureItemType.materials && hasItems && (
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
          {type === FBProcedureItemType.equipment && hasItems && (
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
            <FBMPIProcedureItemSerialsTable
              name={name}
              stepIndex={stepIndex}
              isPreview={isPreview}
              disabled={disabled}
            />
          )}
        </>
      )}
    </FBProvider>
  );
};

export default withFBMPIProcedureItem(FBMPIProcedureItem);
