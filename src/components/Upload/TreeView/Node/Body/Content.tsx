import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as CircleDashIcon } from "assets/icons/circle-dash.svg";
import { ReactComponent as CircleCheckIcon } from "assets/icons/circle-check.svg";
import { ReactComponent as CircleLoadingIcon } from "assets/icons/circle-loading.svg";
import { useTimeout } from "hooks/use-timer";
import { updateNode, updateActiveNode } from "store/actions/upload";
import { formatTime, formatSize } from "util/format";
import { validateNodes } from "util/tree";

const Content = ({ currentNode, treeId }) => {
  const [labelInput, setLabelInput] = useState(currentNode.info.label);

  const { activeNodeId } = useSelector((state) => state.upload);

  const dispatch = useDispatch();

  const [labelTimeout] = useTimeout();

  const labelChangeHandler = (event) => {
    setLabelInput(event.target.value);

    labelTimeout(
      () => dispatch(updateNode({ label: event.target.value }, currentNode.id)),
      300
    );
  };

  const activeNodeHandler = (id) => {
    dispatch(updateActiveNode(id));
  };

  return (
    <div className="upload-node__content">
      <div
        className={`upload-node__title${
          currentNode.id === activeNodeId ? " parent" : ""
        }`}
        onClick={() =>
          currentNode.id !== activeNodeId && activeNodeHandler(currentNode.id)
        }
      >
        {currentNode.info.name}
      </div>

      <div className="upload-node__progress">
        <div className="upload-node__progress--background" />
        <div
          className="upload-node__progress--current"
          style={{ width: currentNode.info.progress + "%" }}
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
              <input
                type="text"
                value={labelInput}
                onChange={labelChangeHandler}
              />
            </div>
          </label>
        )}
        <label className="upload-node__info__timeline" data-label="Timeline">
          <div className="upload-node__info__input">
            <input readOnly value={currentNode.info.timelineStart || "-"} />
            <span>to</span>
            <input readOnly value={currentNode.info.timelineEnd || "-"} />
            <p>Mark timeline with a button below Video Player.</p>
          </div>
        </label>
        <div className="upload-node__info__children" data-label="NextVideos">
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
                    validateNodes(node, "info") ||
                    validateNodes(node, "progress", 100, false)
                  )
                    return (
                      <CircleLoadingIcon
                        key={node.id}
                        onClick={() => activeNodeHandler(node.id)}
                      />
                    );

                  if (validateNodes(node, "error", null, false))
                    return (
                      <CircleLoadingIcon
                        key={node.id}
                        style={{ stroke: "#ff0000" }}
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
              : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
