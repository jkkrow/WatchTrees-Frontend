import { useState } from 'react';

import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import { VideoTree as VideoTreeType } from 'store/slices/video-slice';
import './UploadPreview.scss';

interface PreviewProps {
  tree: VideoTreeType;
}

const Preview: React.FC<PreviewProps> = ({ tree }) => {
  const [activePreview, setActivePreview] = useState(false);

  const togglePreviewHandler = () => {
    setActivePreview((prev) => !prev);
  };

  return (
    <div className={`upload-preview${activePreview ? ' active' : ''}`}>
      <div className="upload-preview__toggle" onClick={togglePreviewHandler}>
        <PreviewIcon className={!activePreview ? ' active' : ''} />
        <RemoveIcon className={activePreview ? ' active' : ''} />
      </div>

      <div className="upload-preview__background">
        <div className="upload-preview__video">
          <VideoTree tree={tree} autoPlay={false} editMode={true} />
        </div>
      </div>
    </div>
  );
};

export default Preview;