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
import { VideoNode, videoActions, NodeInfo } from 'store/slices/video-slice';
import { formatTime, formatSize } from 'util/format';
import { validateNodes } from 'util/tree';

interface ContentProps {
  id: string;
  parentId: string | null;
  rootId: string;
  layer: number;
  info: NodeInfo;
  children: VideoNode[];
}

const Content: React.FC<ContentProps> = ({
  id,
  parentId,
  rootId,
  info,
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
      uploadActions.setNode({
        info: { label: event.target.value },
        nodeId: id,
      })
    );
  };

  const selectionTimeStartChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = +event.target.value;

    if (value > info.duration) {
      value = info.duration;
    }

    if (value > info.selectionTimeEnd) {
      value = info.selectionTimeEnd;
    }

    dispatch(
      uploadActions.setNode({
        info: { selectionTimeStart: value },
        nodeId: id,
      })
    );
  };

  const selectionTimeEndChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = +event.target.value;

    if (value < info.selectionTimeStart) {
      value = info.selectionTimeStart;
    }

    if (value > info.duration) {
      value = info.duration;
    }

    dispatch(
      uploadActions.setNode({
        info: { selectionTimeEnd: value },
        nodeId: id,
      })
    );
  };

  const setSelectionTimeStartHandler = () => {
    const { selectionTimeEnd, duration } = info;

    dispatch(
      uploadActions.setNode({
        info: { selectionTimeStart: +currentProgress.toFixed(3) },
        nodeId: id,
      })
    );

    if (currentProgress > (selectionTimeEnd || 0)) {
      dispatch(
        uploadActions.setNode({
          info: {
            selectionTimeEnd:
              currentProgress + 10 > duration
                ? +duration.toFixed(3)
                : +(currentProgress + 10).toFixed(3),
          },
          nodeId: id,
        })
      );
    }
  };

  const setSelectionTimeEndHandler = () => {
    const { selectionTimeStart } = info;

    dispatch(
      uploadActions.setNode({
        info: { selectionTimeEnd: +currentProgress.toFixed(3) },
        nodeId: id,
      })
    );

    if (currentProgress < (selectionTimeStart || 0)) {
      dispatch(
        uploadActions.setNode({
          info: {
            selectionTimeStart:
              currentProgress - 10 < 0 ? 0 : +(currentProgress - 10).toFixed(3),
          },
          nodeId: id,
        })
      );
    }
  };

  const addChildHandler = () => {
    dispatch(uploadActions.appendNode({ nodeId: id }));
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
          id === activeNodeId && (
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
          style={id === activeNodeId ? { pointerEvents: 'none' } : undefined}
          onClick={() => activeNodeHandler(id)}
        >
          {info.name}
        </div>
        <div className="upload-node__action">
          <Tooltip text="Show preview" direction="left">
            <VideoIcon className="btn" onClick={() => activeVideoHandler(id)} />
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
          style={{ width: info.progress + '%' }}
        />
      </div>

      <div className="upload-node__info">
        <div className="upload-node__info__size" data-label="FileSize">
          {formatSize(info.size)}
        </div>
        <div className="upload-node__info__duration" data-label="Duration">
          {formatTime(info.duration)}
        </div>
        {id !== rootId && (
          <label className="upload-node__info__label" data-label="Label">
            <div className="upload-node__info__input">
              <Input
                id="label"
                type="text"
                value={info.label}
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
                id !== activeVideoId
                  ? 'Show preview first'
                  : 'Set to current time'
              }
              direction="bottom"
            >
              <Button
                small
                disabled={id !== activeVideoId}
                onClick={setSelectionTimeStartHandler}
              >
                <MarkerIcon />
              </Button>
            </Tooltip>
            <Input
              id="selectionTimeStart"
              type="number"
              value={info.selectionTimeStart.toString()}
              onChange={selectionTimeStartChangeHandler}
            />
            <span>to</span>
            <Tooltip
              text={
                id !== activeVideoId
                  ? 'Show preview first'
                  : 'Set to current time'
              }
              direction="bottom"
            >
              <Button
                small
                disabled={id !== activeVideoId}
                onClick={setSelectionTimeEndHandler}
              >
                <MarkerIcon />
              </Button>
            </Tooltip>
            <Input
              id="selectionTimeEnd"
              type="number"
              value={info.selectionTimeEnd.toString()}
              onChange={selectionTimeEndChangeHandler}
            />
          </div>
        </div>
        <div className="upload-node__info__children" data-label="Next Videos">
          <div className="upload-node__info__children__status">
            {children.length
              ? children.map((node) => {
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
