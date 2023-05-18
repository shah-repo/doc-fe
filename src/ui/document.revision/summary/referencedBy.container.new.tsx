import React, { useMemo } from 'react';
import { DataProps } from '../../../state/ducks/common/types';
import { DocumentRevision as Model } from '../../../state/ducks/documentRevisions/types';
import { getReferencedBySummary } from '../utils/references.helpers';
import { ReferenceSummary } from '../utils/types';
import ReferencePresenter from './reference.presenter.new';

type Props = DataProps<Model[]>;

const ReferencedByContainer: React.FunctionComponent<Props> = ({ dataProp }) => {
  const refSummary: ReferenceSummary[] = useMemo(() => getReferencedBySummary(dataProp), [dataProp]);
  return (
    <ReferencePresenter fromReferencedBy={true} label="common.referenced.by" dataProp={refSummary} />
  );
};

export default ReferencedByContainer;
