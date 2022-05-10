import Button from 'components/Common/Element/Button/Button';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppSelector, useAppThunk } from 'hooks/store-hook';
import { sendVerification } from 'store/thunks/auth-thunk';
import './AccountInfo.scss';

interface AccountInfoProps {
  onChangeEditMode: (mode: 'picture' | 'name' | 'password') => () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ onChangeEditMode }) => {
  const { dispatchThunk, loading } = useAppThunk<string | null>(null);
  const { userData } = useAppSelector((state) => state.user);

  const verifyEmailHandler = () => {
    dispatchThunk(sendVerification(userData!.email));
  };

  return (
    <div className="account-info">
      <div className="account-info__picture">
        <Avatar width="10rem" height="10rem" src={userData!.picture} />
        <EditIcon
          className="account-info__edit btn"
          onClick={onChangeEditMode('picture')}
        />
      </div>

      <div className="account-info__name" data-label="Name">
        {userData!.name}
        <EditIcon
          className="account-info__edit btn"
          onClick={onChangeEditMode('name')}
        />
      </div>
      <div className="account-info__email" data-label="Email">
        {userData!.email}
      </div>

      {userData!.type === 'native' && (
        <Button inversed onClick={onChangeEditMode('password')}>
          Change Password
        </Button>
      )}

      {!userData!.isVerified && (
        <Button loading={loading} onClick={verifyEmailHandler}>
          Verify Email
        </Button>
      )}

      {/* {userData!.isVerified && !userData!.isPremium && (
        <Button>Upgrade to Premium</Button>
      )} */}

      <Button inversed invalid>
        Delete Account
      </Button>
    </div>
  );
};

export default AccountInfo;
