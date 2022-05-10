import { useState } from 'react';

import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import FormModal from 'components/Layout/Modal/Form/FormModal';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useForm } from 'hooks/form-hook';
import { useAppSelector, useAppDispatch, useAppThunk } from 'hooks/store-hook';
import { authActions } from 'store/slices/auth-slice';
import { sendVerification, deleteAccount } from 'store/thunks/auth-thunk';
import {
  VALIDATOR_EQUAL,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from 'util/validators';
import './AccountInfo.scss';

interface AccountInfoProps {
  onChangeEditMode: (mode: 'picture' | 'name' | 'password') => () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ onChangeEditMode }) => {
  const [displayModal, setDisplayModal] = useState(false);

  const { dispatchThunk: verifyThunk, loading: verifyLoading } = useAppThunk();
  const { dispatchThunk: deleteThunk, loading: deleteLoading } = useAppThunk();
  const { userData } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { formState, setFormInput } = useForm({
    email: { value: '', isValid: false },
    password: { value: '', isValid: false },
    verify: { value: '', isValid: false },
  });

  const verifyEmailHandler = () => {
    verifyThunk(sendVerification(userData!.email));
  };

  const requestDeleteHandler = () => {
    setDisplayModal(true);
  };

  const cancelDeleteHandler = () => {
    setDisplayModal(false);
  };

  const confirmDeleteHandler = async () => {
    await deleteThunk(
      deleteAccount(
        formState.inputs.email.value,
        formState.inputs.password.value
      )
    );
    dispatch(authActions.signout());
  };

  return (
    <div className="account-info">
      <FormModal
        on={displayModal}
        header="Are you sure you want to delete your account?"
        content={
          <>
            <h4 className="invalid">&#9888; IMPORTANT!</h4>
            <p>
              This process <em>cannot</em> be undone. Your <em>account</em> and{' '}
              <em>created contents</em> will no longer be available.
            </p>
            <p>
              To proceed to delete your account, type <em>delete my account</em>{' '}
              and verify with your <em>email</em> and <em>password</em>.
            </p>

            <Input
              id="verify"
              formInput
              placeholder='Type "delete my account"'
              validators={[VALIDATOR_EQUAL('delete my account')]}
              onForm={setFormInput}
            />
            <Input
              id="email"
              formInput
              placeholder="Email *"
              validators={[VALIDATOR_EMAIL()]}
              onForm={setFormInput}
            />
            <Input
              id="password"
              type="password"
              formInput
              placeholder="Password *"
              validators={[VALIDATOR_REQUIRE()]}
              onForm={setFormInput}
            />
          </>
        }
        footer="Delete Account"
        invalid
        preventEnterSubmit
        disabled={!formState.isValid}
        loading={deleteLoading}
        onConfirm={confirmDeleteHandler}
        onClose={cancelDeleteHandler}
      />

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
        <Button loading={verifyLoading} onClick={verifyEmailHandler}>
          Verify Email
        </Button>
      )}

      {/* {userData!.isVerified && !userData!.isPremium && (
        <Button>Upgrade to Premium</Button>
      )} */}

      <Button inversed invalid onClick={requestDeleteHandler}>
        Delete Account
      </Button>
    </div>
  );
};

export default AccountInfo;
