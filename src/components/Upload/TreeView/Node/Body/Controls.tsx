import { useState } from 'react';

import Tooltip from 'components/Common/UI/Tooltip/Tooltip';
import Warning from './Warning';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as DoubleAngleLeftIcon } from 'assets/icons/double-angle-left.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoNode } from 'store/reducers/video-reducer';
import {
  appendNode,
  updateActiveNode,
  removeNode,
} from 'store/actions/upload-action';
import { updateActiveVideo } from 'store/actions/video-action';
import { validateNodes } from 'util/tree';

interface ControlsProps {
  currentNode: VideoNode;
  treeId: string;
}

const Controls: React.FC<ControlsProps> = ({ currentNode, treeId }) => {
  const { activeNodeId } = useAppSelector((state) => state.upload);
  const { activeVideoId } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();

  const [warning, setWarning] = useState(false);

  const activeNodeHandler = (id: string) => {
    dispatch(updateActiveNode(id));
  };

  const activeVideoHandler = (id: string) => {
    dispatch(updateActiveVideo(id));
  };

  const addChildHandler = () => {
    dispatch(appendNode(currentNode.id));
  };

  const removeNodeHandler = () => {
    const isNotEmpty = validateNodes(currentNode, 'info', null, false);

    if (isNotEmpty && !warning) {
      setWarning(true);
    } else {
      dispatch(removeNode(currentNode.id));

      if (currentNode.id === activeNodeId) {
        activeNodeHandler(currentNode.prevId!);
      }

      if (currentNode.id === activeVideoId) {
        activeVideoHandler(currentNode.prevId!);
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
      {currentNode.id !== treeId && currentNode.id !== activeNodeId && (
        <RemoveIcon
          style={{
            top: '2rem',
            left: '-4rem',
            width: '2.4rem',
            height: '2.4rem',
          }}
          onClick={removeNodeHandler}
        />
      )}
      {currentNode.children.length < 4 && currentNode.info && (
        <Tooltip
          style={{ position: 'absolute', top: '2.5rem', right: '2rem' }}
          text="Append next video"
          direction="left"
        >
          <PlusIcon onClick={addChildHandler} style={{ width: '100%' }} />
        </Tooltip>
      )}
      {currentNode.id === treeId && currentNode.info && (
        <Tooltip
          style={{ position: 'absolute', top: '2rem', left: '2rem' }}
          text="This is first video"
        >
          <strong>ROOT</strong>
        </Tooltip>
      )}
      {currentNode.id === activeNodeId && currentNode.id !== treeId && (
        <DoubleAngleLeftIcon
          style={{ top: '2.5rem', left: '2rem' }}
          onClick={() => activeNodeHandler(treeId)}
        />
      )}
      {currentNode.id === activeNodeId && currentNode.prevId && (
        <AngleLeftIcon
          style={{ top: '2.5rem', left: '4.5rem' }}
          onClick={() => activeNodeHandler(currentNode.prevId!)}
        />
      )}
    </>
  );
};

export default Controls;
