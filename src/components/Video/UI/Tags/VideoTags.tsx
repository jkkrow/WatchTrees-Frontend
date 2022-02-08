import { Link } from 'react-router-dom';

import './VideoTags.scss';

interface TagsProps {
  tags: string[];
}

const VideoTags: React.FC<TagsProps> = ({ tags }) => {
  return tags.length > 0 ? (
    <div className="video-tags">
      {tags.map((tag) => (
        <Link to={`/?search=${tag}`} key={tag} className="video-tag">
          #{tag}
        </Link>
      ))}
    </div>
  ) : null;
};

export default VideoTags;
