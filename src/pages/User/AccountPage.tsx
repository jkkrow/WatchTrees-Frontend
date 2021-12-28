import Button from 'components/Common/Element/Button/Button';
import Modal from 'components/Common/UI/Modal/Modal';
import UserLayout from 'components/User/Layout/UserLayout';
import AccountDashboard from 'components/User/Account/Dashboard/AccountDashboard';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { userActions } from 'store/slices/user-slice';
import { sendVerification } from 'store/thunks/user-thunk';

const AccountPage: React.FC = () => {
  const { userData, loading, error, message } = useAppSelector(
    (state) => state.user
  );
  const { dispatch } = useAppDispatch();

  const verifyEmailHandler = () => {
    dispatch(sendVerification(userData!.email));
  };

  const closeModalHandler = () => {
    dispatch(userActions.clearResponse());
  };

  return (
    <UserLayout>
      <Modal
        on={!!error || !!message}
        type="message"
        header={error ? 'Error' : 'Email has sent'}
        onClose={closeModalHandler}
      >
        <div>{error || message}</div>
      </Modal>
      <AccountDashboard />
      {!userData!.isVerified && (
        <Button loading={loading} onClick={verifyEmailHandler}>
          Verify Email
        </Button>
      )}
      {/* {userData!.isVerified && !userData!.isPremium && (
        <Button>Upgrade to Premium</Button>
      )} */}
    </UserLayout>
  );
};

export default AccountPage;
