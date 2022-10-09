import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import { VideoTree as VideoTreeType } from 'store/types/video';
import './UploadPreview.scss';

interface PreviewProps {
  tree: VideoTreeType;
}

const Preview: React.FC<PreviewProps> = ({ tree }) => {
  return (
    <div className="upload-preview">
      <VideoTree tree={tree} autoPlay={false} editMode={true} />
    </div>
  );
};

export default Preview;
