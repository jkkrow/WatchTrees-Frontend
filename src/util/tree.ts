import { NodeInfo, VideoNode, VideoTree } from 'store/types/video';

export const findById = (tree: VideoTree, id: string): VideoNode | null => {
  let currentNode: VideoNode = tree.root;
  const queue: VideoNode[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    if (currentNode._id === id) return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const findByChildId = (
  tree: VideoTree,
  id: string
): VideoNode | null => {
  let currentNode: VideoNode = tree.root;
  const queue: VideoNode[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    if (currentNode.children.find((item) => item?._id === id))
      return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const traverseNodes = (root: VideoNode): VideoNode[] => {
  let currentNode = root;
  const queue: VideoNode[] = [];
  const nodes: VideoNode[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    nodes.push(currentNode);

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return nodes;
};

export const validateNodes = (
  root: VideoNode,
  key: keyof NodeInfo | 'info',
  value: any = null,
  type = true
): boolean => {
  const nodes = traverseNodes(root);

  if (key === 'info') {
    return !!nodes.find((node) =>
      type ? node.info === value : node.info !== value
    );
  }

  return !!nodes.find((node) => {
    if (!node.info) return false;
    return type ? node.info[key] === value : node.info[key] !== value;
  });
};

export const getAllPaths = (tree: VideoTree): VideoNode[][] => {
  const result: VideoNode[][] = [];

  const iterate = (currentNode: VideoNode, path: VideoNode[]) => {
    const newPath = path.concat(currentNode);

    if (currentNode.children.length) {
      return currentNode.children.forEach((child) => {
        iterate(child, newPath);
      });
    }

    result.push(newPath);
  };

  iterate(tree.root, []);

  return result;
};

export const getFullSize = (tree: VideoTree): number => {
  const nodes = traverseNodes(tree.root);
  const filteredNodes: VideoNode[] = [];
  const seen: { [key: string]: boolean } = {};

  for (let node of nodes) {
    if (!node.info) continue;

    const duplicated = seen.hasOwnProperty(node.info.name);

    if (!duplicated) {
      filteredNodes.push(node);
      seen[node.info.name] = true;
    }
  }

  return filteredNodes.reduce((acc, cur) => acc + (cur.info?.size ?? 0), 0);
};

export const getMinMaxDuration = (
  tree: VideoTree
): { max: number; min: number } => {
  const paths = getAllPaths(tree);

  const possibleDurations = paths.map((path) =>
    path.reduce((acc, cur) => acc + (cur.info?.duration ?? 0), 0)
  );

  return {
    max: Math.max(...possibleDurations),
    min: Math.min(...possibleDurations),
  };
};

export const mapTree = (node: VideoNode) => {
  const map: any = {};

  const iterate = (node: VideoNode) => {
    map[node._id] = node;

    if (node.children.length) {
      node.children.forEach(iterate);
    }
  };

  iterate(node);

  return map;
};

export const findAncestors = (
  tree: VideoTree,
  nodeId: string,
  include?: boolean
) => {
  const map = mapTree(tree.root);

  const ancestors: VideoNode[] = [];
  let parentId = map[nodeId]?.parentId;

  include && ancestors.push(map[nodeId]);

  while (parentId) {
    ancestors.push(map[parentId]);
    parentId = map[parentId]?.parentId;
  }

  return ancestors;
};
