import { useMemo } from 'react';

import Input from 'components/Common/Element/Input/Input';
import Tooltip from 'components/Common/UI/Tooltip/Tooltip';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as AngleLeftDoubleIcon } from 'assets/icons/angle-left-double.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { ReactComponent as CircleDashIcon } from 'assets/icons/circle-dash.svg';
import { ReactComponent as CircleCheckIcon } from 'assets/icons/circle-check.svg';
import { ReactComponent as CircleLoadingIcon } from 'assets/icons/circle-loading.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { uploadActions } from 'store/slices/upload-slice';
import { VideoNode, videoActions } from 'store/slices/video-slice';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';

interface ContentProps {
  currentNode: VideoNode;
  rootId: string;
}

const Content: React.FC<ContentProps> = ({ currentNode, rootId }) => {
  const activeNodeId = useAppSelector((state) => state.upload.activeNodeId);
  const dispatch = useAppDispatch();

  const nodeInfo = useMemo(() => currentNode.info!, [currentNode.info]);

  const labelChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      uploadActions.setNode({
        info: { label: event.target.value },
        nodeId: currentNode._id,
      })
    );
  };

  const selectionTimeStartChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = +event.target.value;

    if (value > nodeInfo.duration) {
      value = nodeInfo.duration;
    }

    if (value > nodeInfo.selectionTimeEnd) {
      value = nodeInfo.selectionTimeEnd;
    }

    dispatch(
      uploadActions.setNode({
        info: { selectionTimeStart: value },
        nodeId: currentNode._id,
      })
    );
  };

  const selectionTimeEndChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = +event.target.value;

    if (value < nodeInfo.selectionTimeStart) {
      value = nodeInfo.selectionTimeStart;
    }

    if (value > nodeInfo.duration) {
      value = nodeInfo.duration;
    }

    dispatch(
      uploadActions.setNode({
        info: { selectionTimeEnd: value },
        nodeId: currentNode._id,
      })
    );
  };

  const addChildHandler = () => {
    dispatch(uploadActions.appendNode({ nodeId: currentNode._id }));
  };

  const activeNodeHandler = (id: string) => {
    dispatch(uploadActions.setActiveNode(id));
  };

  const activeVideoHandler = (id: string) => {
    dispatch(videoActions.setActiveNode(id));
  };

  return (
    <div className="upload-node__content">
      <div className="upload-node__header">
        {currentNode._id === rootId ? (
          <Tooltip text="This is first video">
            <strong>ROOT</strong>
          </Tooltip>
        ) : (
          currentNode._id === activeNodeId && (
            <div className="upload-node__navigation">
              <AngleLeftDoubleIcon
                className="btn"
                onClick={() => activeNodeHandler(rootId)}
              />
              <AngleLeftIcon
                className="btn"
                onClick={() => activeNodeHandler(currentNode._prevId!)}
              />
            </div>
          )
        )}
        <div
          className="upload-node__title"
          style={
            currentNode._id === activeNodeId
              ? { pointerEvents: 'none' }
              : undefined
          }
          onClick={() => activeNodeHandler(currentNode._id)}
        >
          {nodeInfo.name}
        </div>
        <div className="upload-node__action">
          <Tooltip text="Show preview" direction="left">
            <PreviewIcon
              className="btn"
              onClick={() => activeVideoHandler(currentNode._id)}
            />
          </Tooltip>
          {currentNode.children.length < 4 && (
            <Tooltip text="Append next video" direction="left">
              <PlusIcon
                className="btn"
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
        {currentNode._id !== rootId && (
          <label className="upload-node__info__label" data-label="Label">
            <div className="upload-node__info__input">
              <Input
                id="label"
                type="text"
                value={nodeInfo.label}
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
            <Input
              id="selectionTimeStart"
              type="number"
              value={nodeInfo.selectionTimeStart.toString()}
              onChange={selectionTimeStartChangeHandler}
            />
            <span>to</span>
            <Input
              id="selectionTimeEnd"
              type="number"
              value={nodeInfo.selectionTimeEnd.toString()}
              onChange={selectionTimeEndChangeHandler}
            />
          </div>
        </label>
        <div className="upload-node__info__children" data-label="Next Videos">
          <div className="upload-node__info__children__status">
            {currentNode.children.length
              ? currentNode.children.map((node) => {
                  if (!node.info)
                    return (
                      <CircleDashIcon
                        key={node._id}
                        className="btn"
                        onClick={() => activeNodeHandler(node._id)}
                      />
                    );

                  if (
                    validateNodes(node, 'info') ||
                    validateNodes(node, 'progress', 100, false)
                  )
                    return (
                      <CircleLoadingIcon
                        key={node._id}
                        className={`btn${
                          validateNodes(node, 'error', null, false)
                            ? ' invalid'
                            : ''
                        }`}
                        onClick={() => activeNodeHandler(node._id)}
                      />
                    );

                  return (
                    <CircleCheckIcon
                      key={node._id}
                      className="btn"
                      onClick={() => activeNodeHandler(node._id)}
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
