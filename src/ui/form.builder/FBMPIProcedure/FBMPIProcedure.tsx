import { Box } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FBInput, FBMapWrapper, FBMPIProcedureItem, FBMPIProcedureProps, FBProcedureItemType, FBProvider, FBTextEditor, FBTooltip } from '..';
import { ReactComponent as OutlinedCloneIcon } from '../../../assets/images/clone.svg';
import { ReactComponent as CloneIcon } from '../../../assets/images/formBuilder/clone_dark.svg';
import Colors from '../../layout/theme/utils/colors';
import { withFBMPIProcedure } from './FBMPIProcedure.wrap';

const FBMPIProcedure: React.FunctionComponent<FBMPIProcedureProps> = ({
  handleAdd,
  onKeyDown,
  mpiProcedureState,
  isPreview,
  isOutput = true,
  stepIndex,
  disabled,
  types = [],
  name,
  redlineActive,
  autoFocus,
  autoScrollTo,
  ...props
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isAddIconHover, setIsHoverAddIcon] = useState(false);

  return (
    <FBInput {...props } {...{ name }} type="mpiprocedure">
      <Box
        pb={3.8}
        mt={1.75}
        color={Colors.hint_gray}
        borderBottom={1}
      >
        <FBProvider {...{ mpiProcedureState }}>
          {!isPreview && (
            <Box display="flex" flexDirection="row-reverse" mb={-2.5} position="relative" zIndex={1}>
              <Box onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <FBTooltip title="form.builder.clone.step">
                  { isHover ?
                    <CloneIcon
                      data-cy="form.builder.clone.step"
                      onClick={() => handleAdd?.(true)}
                      {...{ disabled }}
                      style={{ marginLeft: '15px', cursor: 'pointer' }}
                    />
                    :
                    <OutlinedCloneIcon
                      data-cy="form.builder.clone.step"
                      onClick={() => handleAdd?.(true)}
                      {...{ disabled }}
                      style={{ marginLeft: '15px', cursor: 'pointer' }}
                    />
                  }
                </FBTooltip>
              </Box>
              <Box onMouseEnter={() => setIsHoverAddIcon(true)}
                onMouseLeave={() => setIsHoverAddIcon(false)}>
                <FBTooltip title="form.builder.add">
                  { isAddIconHover ?
                    <AddCircleIcon style={{ color: Colors.almost_black, width: '17px', height: '17px' }}
                      data-cy="form.builder.add.step"
                      onClick={() => handleAdd?.()}
                      {...{ disabled }}
                    />
                    :
                    <AddCircleOutlineOutlinedIcon  style={{ color: Colors.font_gray, width: '17px', height: '17px' }}
                      data-cy="form.builder.add.step"
                      onClick={() => handleAdd?.()}
                      {...{ disabled }}
                    />
                  }
                </FBTooltip>
              </Box>
            </Box>
          )}
          <FBTextEditor
            {...{ disabled, autoFocus, autoScrollTo, onKeyDown }}
            name={`${name}.description`}
            gutter={false}
            autosave={false}
            shouldNotAutosaveOnBlur={true}
            label={{
              locale: 'form.builder.step.number',
              values: { number: stepIndex },
            }}
            boxProps={{ style: { color: Colors.black, fontSize: 14 } }}
            withState
            removeBorder={isPreview}
          />
          <Box
            display="flex"
            flexDirection="column"
            borderColor={Colors.hint_gray}
            ml={isPreview ? 0 : 1.5}
            border={isPreview ? 0 : 1}
            borderTop={0}
            borderRight={0}
            borderBottom={0}
            pb={0}
          >
            <FBMapWrapper<string[]> collection={types}>
              {(type, index) => (
                <Box
                  key={`fb-procedure-item-${type}-${index}`}
                  display="flex"
                  flexDirection="row"
                  mt={3.8}

                >

                  {!isPreview && (
                    <Box
                      width={11.51}
                      mt={2.7}
                      border={1}
                      borderColor={Colors.chinese_silver}
                      borderBottom={0}
                      borderLeft={0}
                      borderRight={0}
                    />
                  )}
                  <Box flexGrow={1}>
                    <FBMPIProcedureItem
                      defaultValue={props.editorConfig?.attachments}
                      {...{
                        type,
                        name,
                        disabled,
                        isPreview,
                        isOutput,
                        redlineActive,
                      }}
                    />
                  </Box>
                </Box>
              )}
            </FBMapWrapper>
          </Box>
          <Box display="flex" flexDirection="row" mt={3.8} ml={isPreview ? 0 : 1.5}>
            {!isPreview && (
              <Box
                width={10}
                mt={2.7}
                border={0.5}
                borderColor={Colors.hint_gray}
                borderBottom={0}
                borderLeft={0}
                borderRight={0}
              />
            )}
            <Box flexGrow={1}>
              <FBMPIProcedureItem
                type={types.pop() as FBProcedureItemType}
                {...{ name, disabled, isPreview, isOutput, redlineActive }} />
            </Box>
          </Box>
        </FBProvider>
      </Box>
    </FBInput>
  ); };

export default withFBMPIProcedure(FBMPIProcedure);
