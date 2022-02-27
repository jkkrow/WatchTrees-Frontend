import { useState } from 'react';

import Button from 'components/Common/Element/Button/Button';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import EditAccount from '../Edit/EditAccount';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppSelector, useAppThunk } from 'hooks/store-hook';
import { sendVerification } from 'store/thunks/auth-thunk';
import './AccountDashboard.scss';

const AccountDashboard: React.FC = () => {
  const { dispatchThunk, loading } = useAppThunk<string | null>(null);
  const { userData } = useAppSelector((state) => state.user);

  const [editMode, setEditMode] = useState<
    'picture' | 'name' | 'password' | null
  >(null);

  const verifyEmailHandler = () => {
    dispatchThunk(sendVerification(userData!.email));
  };

  return (
    <div className="account-dashboard">
      {!editMode && (
        <>
          <div className="account-dashboard__picture">
            <Avatar width="5rem" height="5rem" src={userData!.picture} />
            <EditIcon
              className="account-dashboard__edit btn"
              onClick={() => setEditMode('picture')}
            />
          </div>
          <div className="account-dashboard__info">
            <div data-label="Name">
              {userData!.name}
              <EditIcon
                className="account-dashboard__edit btn"
                onClick={() => setEditMode('name')}
              />
            </div>
            <div data-label="Email">{userData!.email}</div>
            {userData!.type === 'native' && (
              <div data-label="Password">
                ********
                <EditIcon
                  className="account-dashboard__edit btn"
                  onClick={() => setEditMode('password')}
                />
              </div>
            )}
          </div>
        </>
      )}
      {editMode && (
        <EditAccount type={editMode} onEdit={() => setEditMode(null)} />
      )}

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

export default AccountDashboard;
