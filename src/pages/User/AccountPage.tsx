import UserLayout from 'components/User/Layout/UserLayout';
import AccountProfile from 'components/User/Account/Profile/AccountProfile';

const AccountPage: React.FC = () => {
  return (
    <UserLayout>
      <AccountProfile />
    </UserLayout>
  );
};

export default AccountPage;
