import UserIcon from 'assets/icons/user.svg';
import './Avatar.scss';

interface AvatarProps {
  src?: string;
  width?: string;
  height?: string;
  button?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  width,
  height,
  button = false,
  onClick,
}) => {
  return (
    <div
      className={`avatar${!button ? ' default' : ''}`}
      style={{ width, height }}
      onClick={onClick}
    >
      {src ? <img src={src} alt="" /> : <UserIcon />}
    </div>
  );
};

export default Avatar;
