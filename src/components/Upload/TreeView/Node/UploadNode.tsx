import { useMemo } from 'react';

import Content from './Body/Content';
import Controls from './Body/Controls';
import Error from './Body/Error';
import DragDrop from 'components/Upload/DragDrop/DragDrop';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { RenderNode } from 'store/types/upload';
import { uploadVideo } from 'store/thunks/upload-thunk';
import { findAncestors } from 'util/tree';
import './UploadNode.scss';

interface UploadNodeProps {
  currentNode: RenderNode;
  rootId: string;
}

const UploadNode: React.FC<UploadNodeProps> = ({ currentNode, rootId }) => {
  const activeNodeId = useAppSelector((state) => state.upload.activeNodeId);
  const renderTree = useAppSelector((state) => state.upload.renderTree!);
  const { dispatchThunk } = useAppThunk();

  const isActive = useMemo(
    () => currentNode._id === activeNodeId,
    [currentNode._id, activeNodeId]
  );
  const isActiveChild = useMemo(
    () => currentNode.parentId === activeNodeId,
    [currentNode.parentId, activeNodeId]
  );
  const isAncestor = useMemo(() => {
    const ancestors = findAncestors(renderTree, activeNodeId, true);
    const ids = ancestors.map((item) => item._id);

    return (id: string) => ids.includes(id);
  }, [renderTree, activeNodeId]);

  const fileChangeHandler = (files: File[]): void => {
    dispatchThunk(uploadVideo(files[0], currentNode._id));
  };

  return (
    <div className="upload-node" data-active={isActive}>
      {(isActive || isActiveChild) && (
        <div
          className="upload-node__body"
          data-even={currentNode.level % 2 === 0}
        >
          <Controls currentNode={currentNode} rootId={rootId} />
          {currentNode.url ? (
            <>
              <Content rootId={rootId} {...currentNode} />
              <Error currentNode={currentNode} error={currentNode.error} />
            </>
          ) : (
            <DragDrop type="video" onFile={fileChangeHandler} />
          )}
        </div>
      )}

      <div className="upload-node__children">
        {currentNode.children.map(
          (item) =>
            (isActive || isAncestor(item._id)) && (
              <UploadNode key={item._id} currentNode={item} rootId={rootId} />
            )
        )}
      </div>
    </div>
  );
};

export default UploadNode;
