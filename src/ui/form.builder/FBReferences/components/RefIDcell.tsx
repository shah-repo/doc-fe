import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Tooltip,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import {
  DocumentRevisionStatus,
  EntitySearchResults,
} from '../../../../state/ducks/documentRevisions/types';
import StyledLink from '../../../components/common/kendo/StyledLink';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useHover from '../../../hooks/useHover';
import { Colors } from '../../../layout/theme-next';
import { LIMIT, MIN_SEARCH_TERM_LENGTH } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

interface CustomOptionType extends OptionType {
  revision: string
  title: string
  status: DocumentRevisionStatus
  createdDate?: string
  owner: string
}

const Editor: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  const { setFieldValue } = useFormikContext();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<CustomOptionType[]>([]);
  const [offset, setOffset] = React.useState(0);
  const fetchReferences = useActionCreator(
    documentRevisionsActions.fetchReferences,
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchOptionsDataAsync = useAsync({
    onSuccess: (data?: EntitySearchResults) => {
      const modifiedItems
        = data?.items?.map((item) => {
          const label = translate(
            'form.builder.supplier.references.displayRevision',
            {
              docId: item.document?.docId,
              displayRevision: item.displayRevision,
              name: item?.name,
            },
          );

          return {
            label,
            referenceDisplayName: label,
            value: item.id,
            revision: item.displayRevision,
            title: item?.name,
            status: item.status,
            createdDate: item.createdAt,
            owner: item.owner.user.id,
          };
        }) ?? [];

      if (isEmpty(inputValue)) {
        setItems((prev) => [...prev, ...modifiedItems]);
      } else {
        setItems(modifiedItems);
      }
    },
  });

  const onInputChange = (_, inputVal: string) => {
    if (inputValue === inputVal && !isEmpty(inputVal)) {
      return;
    }

    setInputValue(inputVal);

    if (fetchOptionsDataAsync.isLoading) {
      return;
    }

    if (inputVal && inputVal.length >= MIN_SEARCH_TERM_LENGTH) {
      setOffset(0);
      queryApi(0, inputVal);
    } else if (!inputVal) {
      setOffset(0);
      queryApi(0);
    }
  };

  const onChange = (_, value: CustomOptionType) => {
    setInputValue(value?.label);
    setFieldValue(field, value?.value);
    setFieldValue('referenceDisplayName', value?.label);
    setFieldValue('revision', value?.revision);
    setFieldValue('title', value?.title);
    setFieldValue('status', value?.status);
    setFieldValue('createdDate', value?.createdDate);
    setFieldValue('owner', value?.owner);
  };

  const debounceFunction = debounce(onInputChange, 1000, {
    leading: true,
    trailing: true,
  });

  const onScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;

    if (
      Math.ceil(listboxNode.scrollHeight - listboxNode.scrollTop)
      === listboxNode.clientHeight
    ) {
      const nextOffset = offset + LIMIT;
      setOffset(nextOffset);
      queryApi(nextOffset, inputValue);
    }
  };

  const queryApi = (offset: number, searchText?: string) => {
    fetchOptionsDataAsync.start(
      fetchReferences,
      searchText ?? '',
      offset,
      fetchOptionsDataAsync,
    );
  };

  useEffect(() => {
    if (isUpdateAction) {
      dataItem.referenceDisplayName
        && setInputValue(dataItem.referenceDisplayName);
    } else {
      setInputValue('');
      if (fetchOptionsDataAsync.isLoading) {
        return;
      }

      setItems([]);
      queryApi(0);
    }
  }, [dataItem[MODE_FIELD]]);

  return (
    <FormikField name={field}>
      <Autocomplete
        {...{ onChange }}
        key={isEmpty(items) ? 'disabled' : 'enabled'}
        value={{ label: inputValue }}
        options={items}
        getOptionLabel={(option) => option.label ?? ''}
        filterOptions={(x) => x}
        disabled={isUpdateAction}
        size="small"
        renderOption={(option) => option.label}
        onInputChange={debounceFunction}
        disableClearable
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        ListboxProps={{ onScroll }}
        loading={fetchOptionsDataAsync.isLoading}
      />
    </FormikField>
  );
};

export const RefIDcell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, onClick, onOpenQuickView } = props;
  const classes = styles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [viewIconRef, isHovered] = useHover<HTMLButtonElement>();

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const openQuickView = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => onOpenQuickView?.(evt, dataItem);

  const { referenceDisplayName, documentId, referenceRevId } = dataItem ?? {};

  return (
    <Grid justify="flex-start" alignItems="center" container onClick={handleClick} data-cy="reference-cell">
      <Grid item xs={10} className={classes.grid}>
        {documentId ? (
          <StyledLink
            to={documentVersionPath(referenceRevId, documentId)}
            onClick={(e) => e.stopPropagation()}
            data-cy="selected-reference-item-link"
          >
            {referenceDisplayName}
          </StyledLink>
        ) : referenceDisplayName }
      </Grid>
      <Grid item xs={2}>
        <span ref={viewIconRef} onClick={openQuickView}>
          <Tooltip arrow title={translate('common.quick.view')} placement="top">
            <FontAwesomeIcon
              data-cy="quick-view"
              icon={isHovered ? solid('eye') : regular('eye')}
              color={isHovered ? Colors.navigationBg : Colors.textGray}
            />
          </Tooltip>
        </span>
      </Grid>
    </Grid>
  );
};
