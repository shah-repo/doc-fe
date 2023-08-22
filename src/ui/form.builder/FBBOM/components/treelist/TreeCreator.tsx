import * as d3 from 'd3';
import React, { useEffect } from 'react';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { WhereUsedTree } from './interface';
import useStyles from './styles';

const TEXT_LENGTH = 120;
const OFFSET = 3;

const Loader = () => {
  const classes = useStyles();

  return (
    <div
      data-cy="ar-items-loader"
      className={classes.loader}
    >
      <Text translation="common.loading" />
    </div>
  );
};

export default function TreeCreator ({ docRevId }: { docRevId: string }) {
  const [data, setData] = React.useState<WhereUsedTree[]>();
  const [isLoading, setLoading] = React.useState(false);

  const fetchWhereUsedTreesAction = useActionCreator(documentRevisionsActions.fetchWhereUsedTree);
  const fetchWhereUsedTreesAsync = useAsync({
    onSuccess: (treeList: WhereUsedTree[]| undefined) => {
      setData(treeList);
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

  useEffect(() => {
    if (data === undefined) return;
    if (data.length === 1) {
      // It is just this part and has no tree
      return;
    }

    const counts = {};
    const root = d3.stratify().id((d: any) => {
      if (!counts[d.name]) {
        counts[d.name] = 1;
        return d.name;
      } else {
        return d.name + ' ' + ++counts[d.name];
      }
    }).parentId((d: any) => d.parentDocId)(data);

    const margin = { top: 20, right: 160, bottom: 30, left: 160 };
    const width = 1200 - margin.left - margin.right;
    const height = 640 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    // let nodes = d3.hierarchy(root, d => d.children);
    // let nodes = root;

    // maps the node data to the tree layout
    const nodes = treemap(root);

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select('#treeMap').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    svg.append('svg:defs').append('svg:marker')
      .attr('id', 'arrowhead')
      .attr('refX', 0)
      .attr('refY', 3)
      .attr('markerWidth', 8)
      .attr('markerHeight', 6)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0, 8 3, 0 6')
      .style('fill', '#555');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const links = g.selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter();

    // adds the links between the nodes
    links.append('path')
      .attr('class', 'link')
      // .style('stroke', d => d.depth)
      .attr('d', d => {
        const yEndPos = d.y - 10;
        const yStartPos = d.depth === 1 ? (d?.parent?.y ?? 0) + (2.5 * OFFSET)
          : d?.parent?.y + TEXT_LENGTH + (2.5 * OFFSET);

        return `M ${yStartPos} , ${xTransformation(d.parent)} 
          L ${yEndPos}, ${xTransformation(d)} 
        `;
      })
      .attr('marker-end', 'url(#arrowhead)');

    links.append('path')
      .attr('fill', d => d3.schemeCategory10[d.depth])
      .attr('d', d => {
        const yStartPos = d.depth === 1 ? d.parent.y + (3 * OFFSET)
          : d.parent.y + TEXT_LENGTH + (3 * OFFSET);

        return `M ${yStartPos} , ${xTransformation(d.parent)} 
          A ${OFFSET} ${OFFSET} 0 1 0 ${yStartPos} ${(xTransformation(d.parent) + 0.1)} 
        `;
      });

    // adds each node as a group
    const node = g.selectAll('.node')
      .data(nodes.descendants())
      .enter().append('g')
      .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
      // If it is leaf, then give some space between children
      .attr('transform', (d, index) => {
        return 'translate(' + d.y + ',' + xTransformation(d) + ')';
      });

    // adds the text to the node
    node.append('text')
      .attr('dy', '.45em')
      .attr('x', d => d.children ? 0 : 4)
      .attr('y', 0)
      .attr('textLength', TEXT_LENGTH)
      .attr('class', d => `whereUsedHeadingText ${statusClassDecider(d)}`)
      .style('text-anchor', d => d.depth === 0 ? 'end' : 'start')
      .text(d => `${d?.data?.name} - Rev${d?.data?.revision}`);
  }, [data]);

  const xTransformation = (d) => {
    // d has data, & d has parent, which has children. So if d has no more children, then
    // look at the children in the parent and find what number child is this of the parent
    let childXPos = d.x;
    if (!d.children) {
      const childPos = d.parent?.children?.findIndex(child => child.id === d.id);
      childXPos += childPos === 0 ? 10 : childPos === d.parent?.children?.length - 1 ? 8 : (childPos * 10);
    }
    return childXPos;
  };

  const statusClassDecider = (d) => {
    if (d.data.status === DocumentRevisionStatus.Released) {
      return 'statusReleased';
    } else if (d.data.status === DocumentRevisionStatus.Draft) {
      return 'statusDraft';
    } else if (d.data.status === DocumentRevisionStatus.PendingChange) {
      return 'statusPendingChange';
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div id="treeMap" />
    </>
  );
}
