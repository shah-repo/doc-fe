import { Box, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FBDialog, FBFilesPresenter, FBMapWrapper, FBMediaAlbumField, FBPartItemStatusBg, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemOmitAction, FBProcedureItemProps, FBProcedureItemType, FBProvider, FBText, FBTooltip } from '..';
import Colors from '../../layout/theme/utils/colors';
import { withFBProcedureItem } from './FBProcedureItem.wrap';

const FBProcedureItem: React.FunctionComponent<FBProcedureItemProps> = ({
  onClick,
  handleRemove,
  getItem,
  getLot,
  dialogState,
  isPreview,
  disabled,
  loading,
  type,
  value = [],
  name,
  locked,
}) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <FBProvider {...{ dialogState }}>
      <Box
        borderTop={1}
        borderRight={1}
        borderLeft={1}
        style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
      >
        <FBDialog />
        <Box
          bgcolor={Colors.athens_gray}
          fontWeight="fontWeightBold"
          display="flex"
          borderBottom={1}
        >
          <FBText
            {...{ loading }}
            boxProps={{
              flexGrow: 1,
              display: 'flex',
              py: 1.7,
              pl: 2,
              color: Colors.almost_black,
            }}
            locale={FBProcedureItemLocale[type]}
          />
          {!isPreview && !FBProcedureItemOmitAction.includes(type) && (
            <Box pt={1.8} pr={2}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}>
              <FBTooltip title="form.builder.add">
                {isHover
                  ? <AddCircleIcon style={{ color: Colors.almost_black, width: '17px', height: '17px' }}
                    data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                    onClick={() => onClick?.()}
                    {...{ disabled }}
                  />
                  :                  <AddCircleOutlineOutlinedIcon  style={{ color: Colors.font_gray, width: '17px', height: '17px' }}
                    data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                    onClick={() => onClick?.()}
                    {...{ disabled }}
                  />
                }
              </FBTooltip>
            </Box>
          )}
        </Box>
        {type === FBProcedureItemType.attachments && (
          <Box data-cy="mediaUploadField" mt={2} borderBottom={1}>
            <FBMediaAlbumField
              name={`${name}.attachments`}
              isTemplate={false}
              editorProperties={['copyableValue']}
              gutter={false}
              fieldType="procedure"
              autosave={false}
            />
          </Box>
        )}
        {type !== FBProcedureItemType.attachments && !loading && (
          <FBMapWrapper<FBProcedureItemConfig[]> collection={value}>
            {(item: FBProcedureItemConfig, index) => (
              <Box
                border={1}
                borderLeft={0}
                borderRight={0}
                borderTop={0}
                borderColor={Colors.hint_gray}
                key={`fb-procedure-item-${type}-${index}`}
              >
                <Box
                  display="flex"
                  bgcolor={(item.status || 'none') === 'none' ? 'white' : FBPartItemStatusBg[item.status || '']}
                  p={1.5}
                >
                  <FBText
                    locale={`form.builder.procedure.${type}.title`}
                    values={{
                      title: getItem?.(item.title),
                      lot: getLot?.(item.partLot),
                      quantity: item.quantity || 'form.builder.none',
                      unit: item.unit,
                    }}
                    boxProps={{
                      color: Colors.black,
                      flexGrow: 1,
                    }}
                  />
                  {!isPreview && (
                    <>
                      <Box>
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => onClick?.(item)}
                          {...{ disabled }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box color={Colors.error_red}>
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => handleRemove?.(item.id)}
                          {...{ disabled }}
                        >
                          <RemoveCircleIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
                <Box
                  key="id"
                  display={isEmpty(item.attachments) ? 'none' : 'flex'}
                  bgcolor={(item.status || 'none') === 'none' ? 'white' : FBPartItemStatusBg[item.status || '']}
                  p={1.5}
                  pt={0}
                  pb={0}
                >
                  <FBFilesPresenter files={item.attachments} mode="raw" />
                </Box>
              </Box>
            )}
          </FBMapWrapper>
        )}
      </Box>
    </FBProvider>
  ); };

export default withFBProcedureItem(FBProcedureItem);
