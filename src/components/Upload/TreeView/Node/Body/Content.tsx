import { useState } from 'react';

import { ReactComponent as CircleDashIcon } from 'assets/icons/circle-dash.svg';
import { ReactComponent as CircleCheckIcon } from 'assets/icons/circle-check.svg';
import { ReactComponent as CircleLoadingIcon } from 'assets/icons/circle-loading.svg';
import { useTimeout } from 'hooks/timer-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoNode } from 'store/reducers/video';
import { updateNode, updateActiveNode } from 'store/actions/upload';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';

interface ContentProps {
  currentNode: VideoNode;
  treeId: string;
}

const Content: React.FC<ContentProps> = ({ currentNode, treeId }) => {
  const [labelInput, setLabelInput] = useState(currentNode.info.label);

  const { activeNodeId } = useAppSelector((state) => state.upload);
  const dispatch = useAppDispatch();

  const [labelTimeout] = useTimeout();

  const labelChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelInput(event.target.value);

    labelTimeout(() => dispatch(updateNode({ label: event.target.value }, currentNode.id)), 300);
  };

  const activeNodeHandler = (id: string) => {
    dispatch(updateActiveNode(id));
  };

  return (
    <div className="upload-node__content">
      <div
        className={`upload-node__title${currentNode.id === activeNodeId ? ' parent' : ''}`}
        onClick={() => currentNode.id !== activeNodeId && activeNodeHandler(currentNode.id)}
      >
        {currentNode.info.name}
      </div>

      <div className="upload-node__progress">
        <div className="upload-node__progress--background" />
        <div
          className="upload-node__progress--current"
          style={{ width: currentNode.info.progress + '%' }}
        />
      </div>

      <div className="upload-node__info">
        <div className="upload-node__info__size" data-label="FileSize">
          {formatSize(currentNode.info.size)}
        </div>
        <div className="upload-node__info__duration" data-label="Duration">
          {formatTime(currentNode.info.duration)}
        </div>
        {currentNode.id !== treeId && (
          <label className="upload-node__info__label" data-label="Label">
            <div className="upload-node__info__input">
              <input type="text" value={labelInput} onChange={labelChangeHandler} />
            </div>
          </label>
        )}
        <label className="upload-node__info__timeline" data-label="Timeline">
          <div className="upload-node__info__input">
            <input readOnly value={currentNode.info.timelineStart || '-'} />
            <span>to</span>
            <input readOnly value={currentNode.info.timelineEnd || '-'} />
            <p>Mark timeline with a button below Video Player.</p>
          </div>
        </label>
        <div className="upload-node__info__children" data-label="NextVideos">
          <div className="upload-node__info__children__status">
            {currentNode.children.length
              ? currentNode.children.map((node) => {
                  if (!node.info)
                    return (
                      <CircleDashIcon key={node.id} onClick={() => activeNodeHandler(node.id)} />
                    );

                  if (validateNodes(node, 'info') || validateNodes(node, 'progress', 100, false))
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
                    <CircleCheckIcon key={node.id} onClick={() => activeNodeHandler(node.id)} />
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
