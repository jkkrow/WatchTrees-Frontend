export const findById = (tree, id) => {
  let currentNode = tree.root;
  const queue = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift();

    if (currentNode.id === id) return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const findByChildId = (tree, id) => {
  let currentNode = tree.root;
  const queue = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift();

    if (currentNode.children.find((item) => item?.id === id))
      return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};

export const traverseNodes = (root) => {
  let currentNode = root;
  const queue = [];
  const nodes = [];

  queue.push(currentNode);

  while (queue.length) {
    currentNode = queue.shift();

    nodes.push(currentNode);

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return nodes;
};

export const validateNodes = (root, key, value, type = true) => {
  const nodes = traverseNodes(root);

  if (key === "info") {
    return !!nodes.find((node) =>
      type ? node.info === (value || null) : node.info !== (value || null)
    );
  }

  return !!nodes.find((node) =>
    type ? node.info?.[key] === value : node.info?.[key] !== value
  );
};

export const getAllPaths = (tree) => {
  const result = [];

  const iterate = (currentNode, path) => {
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

export const getFullSize = (tree) => {
  const nodes = traverseNodes(tree.root);

  return nodes.reduce((acc, cur) => acc + (cur.info?.size ?? 0), 0);
};

export const getMinMaxDuration = (tree) => {
  const paths = getAllPaths(tree);

  const possibleDurations = paths.map((path) =>
    path.reduce((acc, cur) => acc + (cur.info?.duration ?? 0), 0)
  );

  return {
    max: Math.max(...possibleDurations),
    min: Math.min(...possibleDurations),
  };
};
