import { RouteComponentProps } from 'react-router-dom';
import { DataProps } from '../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { TrainingRecord } from '../../../state/ducks/training/types';
import { LoadAsyncState } from '../../../state/types';

// Container
export type ContainerProps = ContainerOwnProps & ContainerDispatchProps & ContainerStateProps;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;
export type ContainerStateProps = LoadAsyncState & DataProps<DocumentRevision>;

export interface ContainerDispatchProps {
  load: typeof documentRevisionsActions.load;
}

export enum ReleasedDateOptions {
  LAST_WEEK = 'Last 7 days',
  LAST_TWO_WEEKS = 'Last 14 days',
  LAST_MONTH = 'Last 30 days',
}

export enum CompletedOnDateOptions {
  NEXT_WEEK = 'Due in 7 days',
  PENDING = 'Pending',
  OVERDUE = 'Overdue',
}
export interface RouteParams {
  documentRevisionId: string;
  documentId: string;
}
export interface ReferenceSummary {
  id: string;
  url: string;
  docId?: string;
  title: string;
  displayRevision?: string;
}

export interface TrainingControlProps extends DataProps<TrainingRecord[]> {
  documentRevisionId: string;
  docDetails: Partial<DocumentRevision>;
}
