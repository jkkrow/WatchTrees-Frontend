import Response from 'components/Common/UI/Response/Response';
import EditName from './EditName';
import EditPassword from './EditPassword';
import EditPicture from './EditPicture';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { useAppSelector } from 'hooks/store-hook';
import './EditAccount.scss';

interface EditAccountProps {
  type: 'picture' | 'name' | 'password';
  onEdit: () => void;
}

const EditAccount: React.FC<EditAccountProps> = ({ type, onEdit }) => {
  const { error, message } = useAppSelector((state) => state.user);

  return (
    <div className="edit-account">
      <AngleLeftIcon className="edit-account__cancel" onClick={onEdit} />
      <Response type={error ? 'error' : 'message'} content={error || message} />
      {type === 'name' && <EditName onSuccess={onEdit} />}
      {type === 'password' && <EditPassword onSuccess={onEdit} />}
      {type === 'picture' && <EditPicture onSuccess={onEdit} />}
    </div>
  );
};

export default EditAccount;
