import Button from 'components/Common/Element/Button/Button';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Modal from 'components/Common/UI/Modal/Modal';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { authActions } from 'store/reducers/auth-reducer';
import { sendVerifyEmail } from 'store/thunks/auth-thunk';
import './AccountProfile.scss';

const AccountProfile: React.FC = () => {
  const { loading, error, message } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const verifyEmailHandler = () => {
    dispatch(sendVerifyEmail(userData!.email));
  };

  const closeModalHandler = () => {
    dispatch(authActions.clearResponse());
  };

  return (
    <>
      <Modal
        on={!!error || !!message}
        header={error ? 'Error' : 'Email has sent'}
        content={error || message || ''}
        onClose={closeModalHandler}
      />
      <div className="account-profile">
        <div className="account-profile__picture">
          <Avatar width="5rem" height="5rem" />
        </div>
        <div className="account-profile__info">
          <div data-label="Name">{userData!.name}</div>
          <div data-label="Email">{userData!.email}</div>
          <span className="link">Edit</span>
        </div>
        <div className="account-profile__buttons">
          {!userData!.isVerified && (
            <Button loading={loading} onClick={verifyEmailHandler}>
              Verify Email
            </Button>
          )}
          {userData!.isVerified && !userData!.isPremium && (
            <Button>Upgrade to Premium</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountProfile;
