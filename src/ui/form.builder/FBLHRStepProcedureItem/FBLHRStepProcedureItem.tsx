import { Box, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import cx from 'classnames';
import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FBDialog, FBMapWrapper, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemType, FBText } from '..';
import { toFixed } from '../../dashboard.new/line.items/common/Utils';
import Colors from '../../layout/theme/utils/colors';
import { FBClasses } from '../defaults/layout';
import FBEquipmentTable from '../FBEquipmentTable/components/treelist';
import MaterialsTable from '../FBMaterialsTable/MaterialTable';
import FBProvider from '../FBProvider/FBProvider';
import useStyles from './FBLHRStepProcedureItem.styles';
import { FBLHRStepProcedureItemProps } from './FBLHRStepProcedureItem.types';
import { withFBLHRStepProcedureItem } from './FBLHRStepProcedureItem.wrap';

const FBLHRStepProcedureItem: React.FunctionComponent<FBLHRStepProcedureItemProps> = ({
  onClick,
  getItem,
  dialogState,
  isPreview,
  loading,
  multiplier = 1,
  type,
  value = [],
  lhrStepIndex,
  isPendingChange,
}) => {
  const classes = useStyles({});
  return (
    <FBProvider {...{ dialogState }}>
      <Box mt={4}>
        <FBDialog />
        {type === FBProcedureItemType.attachments && (
          <Box className={classes.attachmentsHeader}>
            <FBText
              {...{ loading }}
              boxProps={{
                flexGrow: 1,
                display: 'flex',
                py: 1.7,
                pl: 2,
              }}
              locale={FBProcedureItemLocale[type]}
            />
          </Box>
        )}
        {type !== FBProcedureItemType.attachments && (
          <Box className={classes.titleText}>
            <FBText {...{ loading }} locale={FBProcedureItemLocale[type]} />
          </Box>
        )}
        {!loading && ![FBProcedureItemType.materials, FBProcedureItemType.equipment].includes(type) && (
          <FBMapWrapper<FBProcedureItemConfig[]> collection={value}>
            {(item: FBProcedureItemConfig, index) => (
              <Box
                borderColor={item.type ? Colors.medium_red : Colors.gray_goose}
                key={`fb-procedure-item-${type}-${index}`}
                className={cx(FBClasses.hoverVisibility, classes.attachmentsRow)}
              >
                <Box
                  bgcolor={item.type ? Colors.light_red : Colors.white}
                  className={cx(FBClasses.hoverVisibility, classes.attachmentsCell)}
                >
                  <Box flexGrow={1}>
                    <FBText
                      locale={
                        item.type
                          ? `form.builder.mpi.procedure.${type}.title.id`
                          : `form.builder.mpi.procedure.${type}.title`
                      }
                      values={
                        item.type
                          ? {
                            id: item.id,
                            title: getItem?.(item.title),
                            quantity: item.quantity ? toFixed(item.quantity * multiplier) : 'form.builder.none',
                            unit: item.unit,
                          }
                          : {
                            title: getItem?.(item.title),
                            quantity: item.quantity ? toFixed(item.quantity * multiplier) : 'form.builder.none',
                            unit: item.unit,
                          }
                      }
                      boxProps={{
                        color: Colors.almost_black,
                        flexGrow: 1,
                      }}
                    />
                  </Box>
                  {(!isPreview || isPendingChange) && (item.type || item.paramsId) && (
                    <>
                      <Box>
                        <IconButton color="inherit" size="small" onClick={() => onClick?.(item)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </FBMapWrapper>
        )}
        {!loading && type === FBProcedureItemType.materials && (
          <MaterialsTable
            isActive={!isPreview}
            isPendingChange={isPendingChange}
            type={type}
            items={value}
            getItem={getItem}
            isDesign={true}
            isLHRStep={true}
            lhrStepIndex={lhrStepIndex}
            isMPIProcedure={true}
          />
        )}
        {!loading && type === FBProcedureItemType.equipment && (
          <FBEquipmentTable
            isPendingChange={isPendingChange}
            isPreview={isPreview}
            isDisabled={!isPreview || isPendingChange}
            type={type}
            items={value}
            getItem={getItem}
            isDesign={true}
            isLHRStep={true}
            lhrStepIndex={lhrStepIndex}
            isMPIProcedure={true}
          />
        )}
      </Box>
    </FBProvider>
  );
};

export default withFBLHRStepProcedureItem(FBLHRStepProcedureItem);
