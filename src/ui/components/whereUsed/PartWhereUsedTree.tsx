import cx from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { IWhereUsedTree } from '../../form.builder/FBBOM/components/treelist/interface';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import Colors from '../../layout/theme/utils/colors';
import Text from '../Text';
import StatusChip from './StatusChip';
import { IRelation } from './WhereUsed.interface';
import useStyles from './whereUsedTree.styles';

const DIV_WIDTH = 240;

const Loader = () => {
  const classes = useStyles({ size: undefined });
  return (
    <div data-cy="tree-items-loader" className={classes.loader}>
      <Text translation="common.loading" />
    </div>
  );
};

export default function PartWhereUsedTree ({ docRevId }: { docRevId: string }): JSX.Element {
  const [dataInLevels, setDataInLevels] = React.useState<{[key: string]: IWhereUsedTree[]}>();
  const [isLoading, setLoading] = React.useState(true);

  const [relationsMap, setRelationsMap] = React.useState<{[key: string]: IRelation[]}>();

  const classes = useStyles({ size: undefined });

  const fetchWhereUsedTreesAction = useActionCreator(documentRevisionsActions.fetchWhereUsedTree);
  const fetchWhereUsedTreesAsync = useAsync({
    onSuccess: (treeList: IWhereUsedTree[]| undefined) => {
      if (!treeList || treeList.length === 1) {
        setLoading(false);
        return;
      }

      setDataInLevels(depthMapper(treeList));
      setRelationsMap(relationMapper(treeList));
      setLoading(false);
    },
  });
  const fetchWhereUsedTree = (docRevId) => {
    setLoading(true);
    fetchWhereUsedTreesAsync.start(fetchWhereUsedTreesAction, docRevId, fetchWhereUsedTreesAsync);
  };

  useEffect(() => {
    fetchWhereUsedTree(docRevId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docRevId]);

  const depthMapper = useMemo(() => (treeList: IWhereUsedTree[]) => {
    const whereUsedDataDepthMap: {[key: string]: IWhereUsedTree[]} = {};
    treeList.forEach((whereUsedEntry: IWhereUsedTree) => {
      const depthToUse = whereUsedEntry.depth.toString();
      if (!whereUsedDataDepthMap[depthToUse]) {
        whereUsedDataDepthMap[depthToUse] = [];
      }
      whereUsedDataDepthMap[depthToUse].push(whereUsedEntry);
    });
    return whereUsedDataDepthMap;
  }, []);

  const relationMapper = useMemo(() => (treeList: IWhereUsedTree[]) => {
    const relationMap: {[key: string]: IRelation[]} = {};
    const whereUsedPartMap = {};
    treeList.forEach(whereUsedEntry => {
      whereUsedPartMap[`${whereUsedPartMapKeyGenerator(whereUsedEntry)}`] = whereUsedEntry;
    });
    treeList.forEach((whereUsedEntry: IWhereUsedTree) => {
      const parentDocId = whereUsedEntry.parentDocId;
      const keyToConsider = `${parentDocId}:${whereUsedEntry.depth}`;
      if (parentDocId) {
        if (!relationMap[keyToConsider]) {
          relationMap[keyToConsider] = [];
        }
        relationMap[keyToConsider].push({
          targetId: idGenerator(whereUsedPartMap[`${whereUsedPartMapKeyGenerator(whereUsedEntry)}`]),
          targetAnchor: 'left',
          sourceAnchor: 'right',
        });
      }
    });
    return relationMap;
  }, []);

  const idGenerator = (entry: IWhereUsedTree) => {
    return `${entry?.name}:${entry?.parentDocId}:${entry?.depth}:${entry.revision}`;
  };

  const whereUsedPartMapKeyGenerator = (entry: IWhereUsedTree) => {
    return `${entry.parentRevId}:${entry.parentDocId}:${entry.depth}`;
  };

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && dataInLevels && relationsMap
        && <div className={classes.treeMap}>
          <ArcherContainer
            strokeColor={Colors.font_gray}
            svgContainerStyle={{ width: dataInLevels ? Object.keys(dataInLevels).length * DIV_WIDTH : '100%' }}
            strokeWidth={0.75}
          >
            {
              Object.keys(dataInLevels).map((level: string) => {
                const whereUsedEntries = dataInLevels[level];
                return (
                  <div className={cx(classes.depthDivPart, classes[`depth-${level}`])} key = {level}>
                    {
                      whereUsedEntries.map(whereUsedEntry => {
                        const { name, revision, status } = whereUsedEntry;
                        return (
                          <ArcherElement
                            id = {idGenerator(whereUsedEntry)}
                            relations= {relationsMap[`${whereUsedEntry.name}:${whereUsedEntry.depth + 1}`]}
                            key={idGenerator(whereUsedEntry)}
                          >
                            <div
                              className={classes.entry}
                              id={idGenerator(whereUsedEntry)}>
                              <p className={classes.mainContent}>
                                <span className={classes.name}>{name}</span><span className={classes.metadataInfo}> - Rev {revision}</span>
                              </p>
                              <StatusChip status={status} />
                            </div>
                          </ArcherElement>
                        );
                      })
                    }
                  </div>
                );
              })
            }
          </ArcherContainer>
        </div>
      }

    </>
  );
}
