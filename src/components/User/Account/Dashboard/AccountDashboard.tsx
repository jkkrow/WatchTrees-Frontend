import { useState } from 'react';

import AccountInfo from '../Info/AccountInfo';
import EditAccount from '../Edit/EditAccount';
import './AccountDashboard.scss';

const AccountDashboard: React.FC = () => {
  type Mode = 'picture' | 'name' | 'password' | null;
  const [editMode, setEditMode] = useState<Mode>(null);

  const changeEditModeHandler = (mode: Mode) => () => {
    setEditMode(mode);
  };

  return (
    <div className="account-dashboard">
      {!editMode && <AccountInfo onChangeEditMode={changeEditModeHandler} />}
      {editMode && (
        <EditAccount type={editMode} onEdit={changeEditModeHandler(null)} />
      )}
    </div>
  );
};

export default AccountDashboard;
