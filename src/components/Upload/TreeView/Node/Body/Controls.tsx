import { useDispatch, useSelector } from "react-redux";

import Tooltip from "components/Common/UI/Tooltip/Tooltip";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import { ReactComponent as AngleLeftIcon } from "assets/icons/angle-left.svg";
import { ReactComponent as DoubleAngleLeftIcon } from "assets/icons/double-angle-left.svg";
import {
  appendChild,
  updateActiveNode,
  removeNode,
  setWarning,
} from "store/actions/upload";
import { updateActiveVideo } from "store/actions/video";
import { validateNodes } from "util/tree";

const Controls = ({ currentNode, treeId }) => {
  const { activeNodeId } = useSelector((state) => state.upload);
  const { activeVideoId } = useSelector((state) => state.video);

  const dispatch = useDispatch();

  const activeNodeHandler = (id) => {
    dispatch(updateActiveNode(id));
  };

  const activeVideoHandler = (id) => {
    dispatch(updateActiveVideo(id));
  };

  const addChildHandler = () => {
    dispatch(appendChild(currentNode.id));
  };

  const removeNodeHandler = () => {
    const isNotEmpty = validateNodes(currentNode, "info", null, false);

    if (isNotEmpty)
      return dispatch(
        setWarning({
          node: currentNode,
          type: "REMOVE",
          header: "Remove Video",
          content:
            "This will remove all videos appended to it. Are you sure to proceed?",
        })
      );

    dispatch(removeNode(currentNode.id));

    if (currentNode.id === activeNodeId) {
      activeNodeHandler(currentNode.prevId);
    }

    if (currentNode.id === activeVideoId) {
      activeVideoHandler(currentNode.prevId);
    }
  };

  return (
    <>
      {currentNode.id !== treeId && (
        <RemoveIcon
          style={{
            top: "2rem",
            left: "-4rem",
            width: "2.4rem",
            height: "2.4rem",
          }}
          onClick={removeNodeHandler}
        />
      )}
      {currentNode.children.length < 4 && currentNode.info && (
        <Tooltip
          style={{ position: "absolute", top: "2.5rem", right: "2rem" }}
          text="Append next video"
          direction="left"
        >
          <PlusIcon onClick={addChildHandler} style={{ width: "100%" }} />
        </Tooltip>
      )}
      {currentNode.id === treeId && currentNode.info && (
        <Tooltip
          style={{ position: "absolute", top: "2rem", left: "2rem" }}
          text="This is first video"
        >
          <strong>ROOT</strong>
        </Tooltip>
      )}
      {currentNode.id === activeNodeId && currentNode.id !== treeId && (
        <DoubleAngleLeftIcon
          style={{ top: "2.5rem", left: "2rem" }}
          onClick={() => activeNodeHandler(treeId)}
        />
      )}
      {currentNode.id === activeNodeId && currentNode.prevId && (
        <AngleLeftIcon
          style={{ top: "2.5rem", left: "4.5rem" }}
          onClick={() => activeNodeHandler(currentNode.prevId)}
        />
      )}
    </>
  );
};

export default Controls;
