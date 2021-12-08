import './VideoTags.scss';

interface TagsProps {
  tags: string[];
}

const VideoTags: React.FC<TagsProps> = ({ tags }) => {
  return tags.length > 0 ? (
    <div className="video-tags">
      {tags.map((tag) => (
        <div key={tag} className="video-tag">
          #{tag}
        </div>
      ))}
    </div>
  ) : null;
};

export default VideoTags;
