import Button from 'components/Common/Element/Button/Button';
import Modal from 'components/Common/UI/Modal/Modal';
import AccountDashboard from 'components/User/Account/Dashboard/AccountDashboard';
import { useAppSelector, useAppThunk } from 'hooks/store-hook';
import { sendVerification } from 'store/thunks/auth-thunk';

const AccountPage: React.FC = () => {
  const { userData } = useAppSelector((state) => state.user);
  const {
    dispatchThunk,
    setData,
    loading,
    error,
    data: message,
  } = useAppThunk<string | null>(null, { errorMessage: false });

  const verifyEmailHandler = () => {
    dispatchThunk(sendVerification(userData!.email));
  };

  const closeModalHandler = () => {
    setData(null);
  };

  return (
    <div className="user-page">
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
    </div>
  );
};

export default AccountPage;
