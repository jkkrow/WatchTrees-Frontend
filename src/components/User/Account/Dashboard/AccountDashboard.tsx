import { useState } from 'react';

import Avatar from 'components/Common/UI/Avatar/Avatar';
import EditAccount from '../Edit/EditAccount';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useAppSelector } from 'hooks/store-hook';
import './AccountDashboard.scss';

const AccountDashboard: React.FC = () => {
  const { userData } = useAppSelector((state) => state.user);

  const [editMode, setEditMode] = useState<
    'picture' | 'name' | 'password' | null
  >(null);

  return (
    <div className="account-profile">
      {!editMode && (
        <>
          <div className="account-profile__picture">
            <Avatar width="5rem" height="5rem" src={userData!.picture} />
            <EditIcon
              className="account-profile__edit"
              onClick={() => setEditMode('picture')}
            />
          </div>
          <div className="account-profile__info">
            <div data-label="Name">
              {userData!.name}
              <EditIcon
                className="account-profile__edit"
                onClick={() => setEditMode('name')}
              />
            </div>
            <div data-label="Email">{userData!.email}</div>
            {userData!.type === 'native' && (
              <div data-label="Password">
                ********
                <EditIcon
                  className="account-profile__edit"
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
    </div>
  );
};

export default AccountDashboard;
