import Input from 'components/Common/Element/Input/Input';
import Tooltip from 'components/Common/UI/Tooltip/Tooltip';
import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { ReactComponent as AngleLeftDoubleIcon } from 'assets/icons/angle-left-double.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as VideoIcon } from 'assets/icons/video.svg';
import { ReactComponent as CircleDashIcon } from 'assets/icons/circle-dash.svg';
import { ReactComponent as CircleCheckIcon } from 'assets/icons/circle-check.svg';
import { ReactComponent as CircleLoadingIcon } from 'assets/icons/circle-loading.svg';
import { ReactComponent as MarkerIcon } from 'assets/icons/marker.svg';
import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import { uploadActions } from 'store/slices/upload-slice';
import { RenderNode } from 'store/types/upload';
import { videoActions } from 'store/slices/video-slice';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';

interface ContentProps extends RenderNode {
  rootId: string;
}

const Content: React.FC<ContentProps> = ({
  _id,
  parentId,
  rootId,
  name,
  label,
  progress,
  size,
  duration,
  selectionTimeStart,
  selectionTimeEnd,
  children,
}) => {
  const activeNodeId = useAppSelector((state) => state.upload.activeNodeId);
  const activeVideoId = useAppSelector((state) => state.video.activeNodeId);
  const currentProgress = useAppSelector(
    (state) => state.video.currentProgress
  );
  const dispatch = useAppDispatch();

  const labelChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      uploadActions.updateNode({
        id: _id,
        info: { label: event.target.value },
      })
    );
  };

  const selectionTimeStartChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = +event.target.value;

    if (value > duration) {
      value = duration;
    }

    if (value > selectionTimeEnd) {
      value = selectionTimeEnd;
    }

    dispatch(
      uploadActions.updateNode({
        id: _id,
        info: { selectionTimeStart: value },
      })
    );
  };

  const selectionTimeEndChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = +event.target.value;

    if (value < selectionTimeStart) {
      value = selectionTimeStart;
    }

    if (value > duration) {
      value = duration;
    }

    dispatch(
      uploadActions.updateNode({
        id: _id,
        info: { selectionTimeEnd: value },
      })
    );
  };

  const setSelectionTimeStartHandler = () => {
    dispatch(
      uploadActions.updateNode({
        id: _id,
        info: { selectionTimeStart: +currentProgress.toFixed(3) },
      })
    );

    if (currentProgress > (selectionTimeEnd || 0)) {
      dispatch(
        uploadActions.updateNode({
          id: _id,
          info: {
            selectionTimeEnd:
              currentProgress + 10 > duration
                ? +duration.toFixed(3)
                : +(currentProgress + 10).toFixed(3),
          },
        })
      );
    }
  };

  const setSelectionTimeEndHandler = () => {
    dispatch(
      uploadActions.updateNode({
        id: _id,
        info: { selectionTimeEnd: +currentProgress.toFixed(3) },
      })
    );

    if (currentProgress < (selectionTimeStart || 0)) {
      dispatch(
        uploadActions.updateNode({
          id: _id,
          info: {
            selectionTimeStart:
              currentProgress - 10 < 0 ? 0 : +(currentProgress - 10).toFixed(3),
          },
        })
      );
    }
  };

  const addChildHandler = () => {
    dispatch(uploadActions.addNode({ parentId: _id }));
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
        {!parentId ? (
          <Tooltip text="This is first video">
            <strong>ROOT</strong>
          </Tooltip>
        ) : (
          _id === activeNodeId && (
            <div className="upload-node__navigation">
              <AngleLeftDoubleIcon
                className="btn"
                onClick={() => activeNodeHandler(rootId)}
              />
              <AngleLeftIcon
                className="btn"
                onClick={() => activeNodeHandler(parentId)}
              />
            </div>
          )
        )}
        <div
          className="upload-node__title"
          style={_id === activeNodeId ? { pointerEvents: 'none' } : undefined}
          onClick={() => activeNodeHandler(_id)}
        >
          {name}
        </div>
        <div className="upload-node__action">
          <Tooltip text="Show preview" direction="left">
            <VideoIcon
              className="btn"
              onClick={() => activeVideoHandler(_id)}
            />
          </Tooltip>
          {children.length < 4 && (
            <Tooltip text="Append next video" direction="left">
              <PlusIcon className="btn" onClick={addChildHandler} />
            </Tooltip>
          )}
        </div>
      </div>

      <div className="upload-node__progress">
        <div className="upload-node__progress--background" />
        <div
          className="upload-node__progress--current"
          style={{ width: progress + '%' }}
        />
      </div>

      <div className="upload-node__info">
        <div className="upload-node__info__size" data-label="FileSize">
          {formatSize(size)}
        </div>
        <div className="upload-node__info__duration" data-label="Duration">
          {formatTime(duration)}
        </div>
        {_id !== rootId && (
          <label className="upload-node__info__label" data-label="Label">
            <div className="upload-node__info__input">
              <Input
                id="label"
                type="text"
                value={label}
                onChange={labelChangeHandler}
              />
            </div>
          </label>
        )}
        <div
          className="upload-node__info__selection-time"
          data-label="Selection Time"
        >
          <div className="upload-node__info__input">
            <Tooltip
              text={
                _id !== activeVideoId
                  ? 'Show preview first'
                  : 'Set to current time'
              }
              direction="bottom"
            >
              <Button
                small
                disabled={_id !== activeVideoId}
                onClick={setSelectionTimeStartHandler}
              >
                <MarkerIcon />
              </Button>
            </Tooltip>
            <Input
              id="selectionTimeStart"
              type="number"
              value={selectionTimeStart.toString()}
              onChange={selectionTimeStartChangeHandler}
            />
            <span>to</span>
            <Tooltip
              text={
                _id !== activeVideoId
                  ? 'Show preview first'
                  : 'Set to current time'
              }
              direction="bottom"
            >
              <Button
                small
                disabled={_id !== activeVideoId}
                onClick={setSelectionTimeEndHandler}
              >
                <MarkerIcon />
              </Button>
            </Tooltip>
            <Input
              id="selectionTimeEnd"
              type="number"
              value={selectionTimeEnd.toString()}
              onChange={selectionTimeEndChangeHandler}
            />
          </div>
        </div>
        <div className="upload-node__info__children" data-label="Next Videos">
          <div className="upload-node__info__children__status">
            {children.length
              ? children.map((node) => {
                  if (!node.url)
                    return (
                      <CircleDashIcon
                        key={node._id}
                        className="btn"
                        onClick={() => activeNodeHandler(node._id)}
                      />
                    );

                  if (
                    validateNodes(node, 'url', '') ||
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
