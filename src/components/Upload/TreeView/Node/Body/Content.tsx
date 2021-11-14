import { useMemo, useState } from 'react';

import Tooltip from 'components/Common/UI/Tooltip/Tooltip';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as DoubleAngleLeftIcon } from 'assets/icons/double-angle-left.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { ReactComponent as CircleDashIcon } from 'assets/icons/circle-dash.svg';
import { ReactComponent as CircleCheckIcon } from 'assets/icons/circle-check.svg';
import { ReactComponent as CircleLoadingIcon } from 'assets/icons/circle-loading.svg';
import { useTimeout } from 'hooks/timer-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { uploadActions } from 'store/reducers/upload-reducer';
import { VideoNode, videoActions } from 'store/reducers/video-reducer';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';

interface ContentProps {
  currentNode: VideoNode;
  treeId: string;
}

const Content: React.FC<ContentProps> = ({ currentNode, treeId }) => {
  const nodeInfo = useMemo(() => currentNode.info!, [currentNode.info]);

  const [labelInput, setLabelInput] = useState(nodeInfo.label);

  const { activeNodeId } = useAppSelector((state) => state.upload);
  const dispatch = useAppDispatch();

  const [labelTimeout] = useTimeout();

  const labelChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelInput(event.target.value);

    labelTimeout(
      () =>
        dispatch(
          uploadActions.setNode({
            info: { label: event.target.value },
            nodeId: currentNode.id,
          })
        ),
      300
    );
  };

  const addChildHandler = () => {
    dispatch(uploadActions.appendNode({ nodeId: currentNode.id }));
  };

  const activeNodeHandler = (id: string) => {
    dispatch(uploadActions.setActiveNode(id));
  };

  const activeVideoHandler = (id: string) => {
    dispatch(videoActions.setActiveVideo(id));
  };

  return (
    <div className="upload-node__content">
      <div className="upload-node__header">
        {currentNode.id === treeId ? (
          <Tooltip text="This is first video">
            <strong>ROOT</strong>
          </Tooltip>
        ) : (
          currentNode.id === activeNodeId && (
            <div className="upload-node__navigation">
              <DoubleAngleLeftIcon onClick={() => activeNodeHandler(treeId)} />
              <AngleLeftIcon
                onClick={() => activeNodeHandler(currentNode.prevId!)}
              />
            </div>
          )
        )}
        <div
          className="upload-node__title"
          style={
            currentNode.id === activeNodeId
              ? { pointerEvents: 'none' }
              : undefined
          }
          onClick={() => activeNodeHandler(currentNode.id)}
        >
          {nodeInfo.name}
        </div>
        <div className="upload-node__action">
          <Tooltip text="Show preview" direction="left">
            <PreviewIcon onClick={() => activeVideoHandler(currentNode.id)} />
          </Tooltip>
          {currentNode.children.length < 4 && (
            <Tooltip text="Append next video" direction="left">
              <PlusIcon
                onClick={addChildHandler}
                style={{ width: '1.7rem', height: '1.7rem' }}
              />
            </Tooltip>
          )}
        </div>
      </div>

      <div className="upload-node__progress">
        <div className="upload-node__progress--background" />
        <div
          className="upload-node__progress--current"
          style={{ width: nodeInfo.progress + '%' }}
        />
      </div>

      <div className="upload-node__info">
        <div className="upload-node__info__size" data-label="FileSize">
          {formatSize(nodeInfo.size)}
        </div>
        <div className="upload-node__info__duration" data-label="Duration">
          {formatTime(nodeInfo.duration)}
        </div>
        {currentNode.id !== treeId && (
          <label className="upload-node__info__label" data-label="Label">
            <div className="upload-node__info__input">
              <input
                type="text"
                value={labelInput}
                onChange={labelChangeHandler}
              />
            </div>
          </label>
        )}
        <label
          className="upload-node__info__selection-time"
          data-label="Selection Time"
        >
          <div className="upload-node__info__input">
            <input readOnly value={nodeInfo.selectionTimeStart || '-'} />
            <span>to</span>
            <input readOnly value={nodeInfo.selectionTimeEnd || '-'} />
            <p>
              Mark selection time position with a button below Video Player.
            </p>
          </div>
        </label>
        <div className="upload-node__info__children" data-label="Next Videos">
          <div className="upload-node__info__children__status">
            {currentNode.children.length
              ? currentNode.children.map((node) => {
                  if (!node.info)
                    return (
                      <CircleDashIcon
                        key={node.id}
                        onClick={() => activeNodeHandler(node.id)}
                      />
                    );

                  if (
                    validateNodes(node, 'info') ||
                    validateNodes(node, 'progress', 100, false)
                  )
                    return (
                      <CircleLoadingIcon
                        key={node.id}
                        style={
                          validateNodes(node, 'error', null, false)
                            ? {
                                stroke: '#ff0000',
                              }
                            : undefined
                        }
                        onClick={() => activeNodeHandler(node.id)}
                      />
                    );

                  return (
                    <CircleCheckIcon
                      key={node.id}
                      onClick={() => activeNodeHandler(node.id)}
                    />
                  );
                })
              : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
