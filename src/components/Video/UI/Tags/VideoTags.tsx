import { useHistory } from 'react-router';

import './VideoTags.scss';

interface TagsProps {
  tags: string[];
}

const VideoTags: React.FC<TagsProps> = ({ tags }) => {
  const history = useHistory();

  const searchHandler = (tag: string) => {
    history.push(`/?search=${tag}`);
  };

  return tags.length > 0 ? (
    <div className="video-tags">
      {tags.map((tag) => (
        <div
          key={tag}
          className="video-tag link"
          onClick={() => searchHandler(tag)}
        >
          #{tag}
        </div>
      ))}
    </div>
  ) : null;
};

export default VideoTags;
