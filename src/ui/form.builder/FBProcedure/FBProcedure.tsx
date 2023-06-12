import { Box } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FBInput, FBLabel, FBMapWrapper, FBProcedureItem, FBProcedureItemType, FBProcedureProps, FBProvider, FBTextEditor, FBTooltip } from '..';
import { ReactComponent as OutlinedCloneIcon } from '../../../assets/images/clone.svg';
import { ReactComponent as CloneIcon } from '../../../assets/images/formBuilder/clone_dark.svg';
import Colors from '../../layout/theme/utils/colors';
import { FBFontStyle } from '../styles/FBFont.styles';
import { styles } from './FBProcedure.style';
import { withFBProcedure } from './FBProcedure.wrap';

const FBProcedure: React.FunctionComponent<FBProcedureProps> = ({
  onKeyDown,
  handleAdd,
  procedureState,
  workspaceState,
  isPreview,
  isOutput,
  stepIndex,
  disabled,
  types = [],
  name,
  autoFocus,
  autoScrollTo,
  ...props
}) => {
  const classes = styles();
  const [isHover, setIsHover] = useState(false);
  const [isAddIconHover, setIsHoverAddIcon] = useState(false);
  return (
    <FBInput {...props } {...{ name }} type="procedure">
      {!isOutput && (
        <FBLabel
          label={{
            locale: 'form.builder.step.number',
            values: { number: stepIndex },
          }}
          labelProps={FBFontStyle.labelProps}
        />
      )}
      <Box
        pb={3}
        color={Colors.hint_gray}
        borderBottom={2}
      >
        {isOutput && (
          <FBProvider {...{ procedureState }}>
            {!isPreview && (
              <Box className={classes.btnAlign}>
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
              label={{
                locale: 'form.builder.step.number',
                values: { number: stepIndex },
              }}
              autosave={false}
              shouldNotAutosaveOnBlur={true}
              withState
              boxProps={{ style: { color: Colors.black } }}
            />
            <Box
              display="flex"
              flexDirection="column"
              borderColor={Colors.hint_gray}
              ml={isPreview ? 0 : 1.5}
              mt={1}
              border={isPreview ? 0 : 1}
              borderTop={0}
              borderRight={0}
              borderBottom={0}
              pb={7.5}
            >
              <FBMapWrapper<string[]> collection={types.slice(0, -1)}>
                {(type, index) => (
                  <Box
                    key={`fb-procedure-item-${type}-${index}`}
                    display="flex"
                    flexDirection="row"
                    mt={5}
                  >
                    {!isPreview && (
                      <Box
                        width={10}
                        mr={1}
                        mt={2.7}
                        border={0.5}
                        borderColor={Colors.hint_gray}
                        borderBottom={0}
                        borderLeft={0}
                        borderRight={0}
                      />
                    )}
                    <Box flexGrow={1}>
                      <FBProcedureItem {...{ type, name, disabled, isPreview }} />
                    </Box>
                  </Box>
                )}
              </FBMapWrapper>
            </Box>
            <Box display="flex" flexDirection="row" mt={-2.7} ml={isPreview ? 0 : 1.5}>
              {!isPreview && (
                <Box
                  width={10}
                  mr={1}
                  mt={2.7}
                  border={0.5}
                  borderColor={Colors.hint_gray}
                  borderBottom={0}
                  borderLeft={0}
                  borderRight={0}
                />
              )}
              <Box flexGrow={1}>
                <FBProcedureItem type={types.pop() as FBProcedureItemType} {...{ name, disabled, isPreview }} />
              </Box>
            </Box>
          </FBProvider>
        )}
      </Box>
    </FBInput>
  );
};
export default withFBProcedure(FBProcedure);
