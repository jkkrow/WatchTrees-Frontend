import { ReactComponent as PreviewIcon } from 'assets/icons/preview.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import { useAppSelector, useAppDispatch } from 'hooks/store-hook';
import { VideoTree as VideoTreeType } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';
import './UploadPreview.scss';

interface PreviewProps {
  tree: VideoTreeType;
}

const Preview: React.FC<PreviewProps> = ({ tree }) => {
  const dispatch = useAppDispatch();
  const isPreviewActive = useAppSelector(
    (state) => state.upload.isPreviewActive
  );

  const togglePreviewHandler = () => {
    dispatch(uploadActions.setActivePreview(!isPreviewActive));
  };

  return (
    <div className={`upload-preview${isPreviewActive ? ' active' : ''}`}>
      <div className="upload-preview__toggle" onClick={togglePreviewHandler}>
        <PreviewIcon className={!isPreviewActive ? ' active' : ''} />
        <RemoveIcon className={isPreviewActive ? ' active' : ''} />
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
