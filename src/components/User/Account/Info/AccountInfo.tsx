import { useNavigate } from 'react-router-dom';

import Button from 'components/Common/Element/Button/Button';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import DeleteAccount from '../Delete/DeleteAccount';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { sendVerification } from 'store/thunks/auth-thunk';
import { isPremium } from 'util/user';
import './AccountInfo.scss';

interface AccountInfoProps {
  onChangeEditMode: (mode: 'picture' | 'name' | 'password') => () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ onChangeEditMode }) => {
  const { dispatchThunk, loading } = useAppThunk();
  const { userData } = useAppSelector((state) => state.user);

  const navigate = useNavigate();

  const verifyEmailHandler = () => {
    dispatchThunk(sendVerification(userData!.email));
  };

  const navigateHandler = (path: string) => {
    return () => {
      navigate(path);
    };
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="account-info">
      <div className="account-info__picture">
        <Avatar width="10rem" height="10rem" src={userData.picture} />
        <EditIcon
          className="account-info__edit btn"
          onClick={onChangeEditMode('picture')}
        />
      </div>

      <div className="account-info__name" data-label="Name">
        {userData.name}
        <EditIcon
          className="account-info__edit btn"
          onClick={onChangeEditMode('name')}
        />
      </div>
      <div className="account-info__email" data-label="Email">
        {userData.email}
      </div>

      <div className="account-info__buttons">
        {!userData.isVerified && (
          <Button loading={loading} onClick={verifyEmailHandler}>
            Verify Email
          </Button>
        )}

        {userData.isVerified && !isPremium(userData) && (
          <Button onClick={navigateHandler('/premium')}>
            Upgrade to Premium
          </Button>
        )}

        {isPremium(userData) && (
          <Button inversed onClick={navigateHandler('/user/premium')}>
            Manage Premium Membership
          </Button>
        )}

        {userData.type === 'native' && (
          <Button inversed onClick={onChangeEditMode('password')}>
            Change Password
          </Button>
        )}

        <DeleteAccount userData={userData} />
      </div>
    </div>
  );
};

export default AccountInfo;
