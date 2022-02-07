import { createPortal } from 'react-dom';
import { NavLink, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from 'components/Layout/Backdrop/Backdrop';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import { ReactComponent as VideoIcon } from 'assets/icons/preview.svg';
import { ReactComponent as FavoriteIcon } from 'assets/icons/favorite.svg';
import { ReactComponent as TimeIcon } from 'assets/icons/time.svg';
import { ReactComponent as SigninIcon } from 'assets/icons/signin.svg';
import { ReactComponent as SignoutIcon } from 'assets/icons/signout.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { authActions } from 'store/slices/auth-slice';
import { uploadActions } from 'store/slices/upload-slice';
import './Menu.scss';

interface MenuProps {
  on: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ on, onClose }) => {
  const uploadTree = useAppSelector((state) => state.upload.uploadTree);
  const userData = useAppSelector((state) => state.user.userData);
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
    dispatch(authActions.signout());

    history.push('/auth');
  };

  return createPortal(
    <>
      <CSSTransition
        in={on}
        classNames="menu"
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className="menu">
          <ul className="menu__list">
            {userData && (
              <>
                <div className="menu__user">
                  <div className="menu__user__header">
                    <Avatar src={userData.picture} width="3rem" height="3rem" />
                    <h4 className="menu__user__name">{userData.name}</h4>
                  </div>
                </div>
                <li>
                  <NavLink
                    activeClassName="menu__list--active"
                    to="/user/account"
                  >
                    <UserIcon />
                    Account
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="menu__list--active"
                    to="/user/videos"
                  >
                    <VideoIcon />
                    My Videos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="menu__list--active"
                    to="/user/favorites"
                  >
                    <FavoriteIcon />
                    Favorites
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink activeClassName="menu__list--active" to="/history">
                <TimeIcon />
                History
              </NavLink>
            </li>
            <li>
              {userData ? (
                <div className="link" onClick={logoutHandler}>
                  <SignoutIcon />
                  Signout
                </div>
              ) : (
                <NavLink activeClassName="menu__list--active" to="/auth">
                  <SigninIcon />
                  Signin
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </CSSTransition>
      <Backdrop on={on} opacity={0.3} onClick={onClose} />
    </>,
    document.getElementById('menu-hook')!
  );
};

export default Menu;
