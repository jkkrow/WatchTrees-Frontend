import { useState } from 'react';
import jwtDecode from 'jwt-decode';

import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import FormModal from 'components/Layout/Modal/Form/FormModal';
import GoogleLogin from 'components/Auth/GoogleLogin/GoogleLogin';
import { useForm } from 'hooks/common/form';
import { useAppDispatch, useAppThunk } from 'hooks/common/store';
import { UserData } from 'store/slices/user-slice';
import { authActions } from 'store/slices/auth-slice';
import { deleteAccount } from 'store/thunks/auth-thunk';
import {
  VALIDATOR_EQUAL,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from 'util/validators';
import './DeleteAccount.scss';

interface DeleteAccountProps {
  userData: UserData;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ userData }) => {
  const [displayModal, setDisplayModal] = useState(false);

  const { dispatchThunk, loading } = useAppThunk();
  const dispatch = useAppDispatch();

  const verifyForm =
    userData.type === 'native'
      ? {
          email: { value: '', isValid: false },
          password: { value: '', isValid: false },
          verify: { value: '', isValid: false },
        }
      : {
          verify: { value: '', isValid: false },
          credential: { value: '', isValid: false },
        };

  const { formState, setFormInput } = useForm(verifyForm);

  const requestDeleteHandler = () => {
    setDisplayModal(true);
  };

  const cancelDeleteHandler = () => {
    setDisplayModal(false);
  };

  const verifyGoogleHandler = (credential: string) => {
    const result = jwtDecode<GoogleTokenPayload>(credential);
    const isValid = result.email === userData.email;

    setFormInput('credential', credential, isValid);
  };

  const confirmDeleteHandler = async () => {
    if (userData.type === 'native') {
      await dispatchThunk(
        deleteAccount({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        })
      );
    }
    if (userData.type === 'google') {
      await dispatchThunk(
        deleteAccount({
          tokenId: formState.inputs.credential.value,
        })
      );
    }

    dispatch(authActions.signout());
  };

  return (
    <>
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
              and verify with your{' '}
              {userData.type === 'native' && (
                <>
                  <em>email</em> and <em>password</em>
                </>
              )}
              {userData.type === 'google' && <em>google account</em>}.
            </p>

            <Input
              id="verify"
              formInput
              placeholder='Type "delete my account"'
              validators={[VALIDATOR_EQUAL('delete my account')]}
              onForm={setFormInput}
            />
            {userData.type === 'native' && (
              <Input
                id="email"
                formInput
                placeholder="Email *"
                validators={[VALIDATOR_EMAIL()]}
                onForm={setFormInput}
              />
            )}
            {userData.type === 'native' && (
              <Input
                id="password"
                type="password"
                formInput
                placeholder="Password *"
                validators={[VALIDATOR_REQUIRE()]}
                onForm={setFormInput}
              />
            )}
            {userData.type === 'google' && (
              <GoogleLogin
                label="Verify with Google"
                invalid={
                  !formState.inputs.credential.isValid &&
                  formState.inputs.credential.value
                }
                disabled={formState.inputs.credential.isValid}
                onVerify={verifyGoogleHandler}
              />
            )}
          </>
        }
        footer="Delete Account"
        invalid
        preventEnterSubmit
        disabled={!formState.isValid}
        loading={loading}
        onConfirm={confirmDeleteHandler}
        onClose={cancelDeleteHandler}
      />

      <Button inversed invalid onClick={requestDeleteHandler}>
        Delete Account
      </Button>
    </>
  );
};

export default DeleteAccount;
