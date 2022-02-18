import { useState } from 'react';

import Warning from './Warning';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as AngleLeftDoubleIcon } from 'assets/icons/angle-left-double.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoNode, videoActions } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';
import { validateNodes } from 'util/tree';

interface ControlsProps {
  currentNode: VideoNode;
  rootId: string;
}

const Controls: React.FC<ControlsProps> = ({ currentNode, rootId }) => {
  const activeNodeId = useAppSelector((state) => state.upload.activeNodeId);
  const activeVideoId = useAppSelector((state) => state.video.activeNodeId);
  const dispatch = useAppDispatch();

  const [warning, setWarning] = useState(false);

  const activeNodeHandler = (id: string) => {
    dispatch(uploadActions.setActiveNode(id));
  };

  const activeVideoHandler = (id: string) => {
    dispatch(videoActions.setActiveNode(id));
  };

  const removeNodeHandler = () => {
    const isNotEmpty = validateNodes(currentNode, 'info', null, false);

    if (isNotEmpty && !warning) {
      setWarning(true);
    } else {
      dispatch(uploadActions.removeNode({ nodeId: currentNode._id }));

      if (currentNode._id === activeNodeId) {
        activeNodeHandler(currentNode._prevId!);
      }

      if (currentNode._id === activeVideoId) {
        activeVideoHandler(currentNode._prevId!);
      }
    }
  };

  const cancelRemoveHandler = () => {
    setWarning(false);
  };

  return (
    <>
      {warning && (
        <Warning onRemove={removeNodeHandler} onCancel={cancelRemoveHandler} />
      )}
      {currentNode._id !== rootId && currentNode._id !== activeNodeId && (
        <RemoveIcon
          className="btn"
          style={{
            top: '2rem',
            left: '-4rem',
            width: '2.4rem',
            height: '2.4rem',
          }}
          onClick={removeNodeHandler}
        />
      )}
      {!currentNode.info &&
        currentNode._id !== rootId &&
        currentNode._id === activeNodeId && (
          <div
            className="upload-node__navigation"
            style={{
              position: 'absolute',
              top: '2.5rem',
              left: '2rem',
              zIndex: 1,
            }}
          >
            <AngleLeftDoubleIcon
              className="btn"
              onClick={() => activeNodeHandler(rootId)}
            />
            <AngleLeftIcon
              className="btn"
              onClick={() => activeNodeHandler(currentNode._prevId!)}
            />
          </div>
        )}
    </>
  );
};

export default Controls;
