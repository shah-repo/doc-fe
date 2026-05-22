import { useSelector } from 'react-redux';
import { documentTypeSelectors } from '../../state/ducks/documentRevisions/documentType';
import { ApplicationState } from '../../state/reducers';
import { checkIsDocumentMPIOutput } from '../documentRevision/helpers/checkDocumentGroup';

interface UseLhrsTitleReturn {
  stepIndex?: number
  title?: string
}

const STEP_REGEX = /Step #([0-9])+/;

const DEFAULT_RETURN: UseLhrsTitleReturn = {
  stepIndex: undefined,
  title: undefined,
};

export const useLhrsTitle = (name?: string, documentTypeId = ''): UseLhrsTitleReturn => {
  const documentType = useSelector(
    (state: ApplicationState) => documentTypeSelectors.getDocumentTypeById(state, documentTypeId),
  );

  if (!name) {
    return DEFAULT_RETURN;
  }

  const isTypeMpiOutput = checkIsDocumentMPIOutput(documentType?.groupOptions);

  if (!isTypeMpiOutput) {
    return DEFAULT_RETURN;
  }

  const mpiOutputTitle = STEP_REGEX.exec(name);

  if (!mpiOutputTitle) {
    return DEFAULT_RETURN;
  }

  return {
    stepIndex: parseInt(mpiOutputTitle[1]),
    title: mpiOutputTitle[0],
  };
};
