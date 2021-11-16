import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as ReloadIcon } from 'assets/icons/reload.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppSelector } from 'hooks/store-hook';
import './UserVideoHeader.scss';

interface UserVideoHeaderProps {
  onReload: () => void;
  onAdd: () => void;
}

const UserVideoHeader: React.FC<UserVideoHeaderProps> = ({
  onReload,
  onAdd,
}) => {
  const { uploadTree } = useAppSelector((state) => state.upload);

  return (
    <div className="user-video-header">
      <div>
        <Button inversed onClick={onReload}>
          <ReloadIcon />
        </Button>
      </div>
      <div>
        <Button inversed onClick={onAdd}>
          {!uploadTree ? (
            <>
              <PlusIcon style={{ width: '1.2rem', height: '1.2rem' }} />
              NEW VIDEO
            </>
          ) : (
            <>
              <EditIcon style={{ width: '1.5rem', height: '1.5rem' }} />
              CONTINUE
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserVideoHeader;
