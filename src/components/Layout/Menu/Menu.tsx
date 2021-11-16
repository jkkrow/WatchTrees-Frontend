import { createPortal } from 'react-dom';
import { NavLink, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from 'components/Common/UI/Backdrop/Backdrop';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { uploadActions } from 'store/slices/upload-slice';
import { logout } from 'store/thunks/auth-thunk';
import './Menu.scss';

interface MenuProps {
  on: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ on, onClose }) => {
  const { uploadTree } = useAppSelector((state) => state.upload);
  const { userData } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const history = useHistory();

  const logoutHandler = () => {
    if (uploadTree) {
      const result = window.confirm(
        'There is unfinished uploading process. The process will be lost if you logout. Are you sure to proceed?'
      );

      if (!result) return;
    }

    dispatch(uploadActions.finishUpload());
    dispatch(logout());
    history.push('/auth');
  };

  return createPortal(
    <>
      <CSSTransition
        in={on && !!userData}
        classNames="menu"
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className="menu">
          <ul className="menu__list">
            <li>
              <NavLink activeStyle={{ opacity: 0.7 }} to="/user/account">
                Account
              </NavLink>
            </li>
            <li>
              <NavLink activeStyle={{ opacity: 0.7 }} to="/user/videos">
                My Videos
              </NavLink>
            </li>
            <li>
              <NavLink activeStyle={{ opacity: 0.7 }} to="/user/history">
                History
              </NavLink>
            </li>
            <li>
              <div className="link" onClick={logoutHandler}>
                Logout
              </div>
            </li>
          </ul>
        </div>
      </CSSTransition>
      <Backdrop on={on} onClick={onClose} />
    </>,
    document.getElementById('menu-hook')!
  );
};

export default Menu;
