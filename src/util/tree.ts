import { Tree, Node, VideoTree, VideoNode } from 'store/types/video';

export const findById = <T extends Tree>(
  tree: T,
  id: string
): T['root'] | null => {
  let currentNode = tree.root;
  const queue: T['root'][] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    if (currentNode._id === id) return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const findByChildId = <T extends Tree>(
  tree: T,
  id: string
): T['root'] | null => {
  let currentNode = tree.root;
  const queue: T['root'][] = [];

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

export const traverseNodes = <T extends Node>(root: T): T[] => {
  let currentNode = root;
  const queue: T[] = [];
  const nodes: T[] = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift()!;

    nodes.push(currentNode);

    if (currentNode.children.length)
      (currentNode.children as T[]).forEach((child) => queue.push(child));
  }

  return nodes;
};

export const getAllPaths = <T extends Tree>(tree: T): T['root'][][] => {
  const result: T['root'][][] = [];

  const iterate = (currentNode: Node, path: Node[]) => {
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

export const mapTree = <T extends Node>(node: T) => {
  const map: any = {};

  const iterate = (node: T) => {
    map[node._id] = node;

    if (node.children.length) {
      (node.children as T[]).forEach(iterate);
    }
  };

  iterate(node);

  return map;
};

export const findAncestors = <T extends Tree>(
  tree: T,
  nodeId: string,
  include?: boolean
) => {
  const map = mapTree(tree.root);

  const ancestors: T['root'][] = [];
  let parentId = map[nodeId]?.parentId;

  include && ancestors.push(map[nodeId]);

  while (parentId) {
    ancestors.push(map[parentId]);
    parentId = map[parentId]?.parentId;
  }

  return ancestors;
};

/**
 * VideoTree Specific
 */

export const validateNodes = <T extends VideoNode>(
  root: T,
  key: keyof T,
  value: any,
  type = true
): boolean => {
  const nodes = traverseNodes<T>(root);

  return !!nodes.find((node) => {
    return type ? node[key] === value : node[key] !== value;
  });
};

export const getFullSize = <T extends VideoTree>(tree: T): number => {
  const nodes = traverseNodes(tree.root);
  const filteredNodes: T['root'][] = [];
  const seen: { [key: string]: boolean } = {};

  for (let node of nodes) {
    const duplicated = seen.hasOwnProperty(node.name);

    if (!duplicated) {
      filteredNodes.push(node);
      seen[node.name] = true;
    }
  }

  return filteredNodes.reduce((acc, cur) => acc + (cur.size ?? 0), 0);
};

export const getMinMaxDuration = <T extends VideoTree>(
  tree: T
): { max: number; min: number } => {
  const paths = getAllPaths(tree);

  const possibleDurations = paths.map((path) =>
    path.reduce((acc, cur) => acc + (cur.duration ?? 0), 0)
  );

  return {
    max: Math.max(...possibleDurations),
    min: Math.min(...possibleDurations),
  };
};
