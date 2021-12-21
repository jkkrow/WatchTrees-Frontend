import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { useForm } from 'hooks/form-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { updateUserPassword } from 'store/thunks/user-thunk';
import {
  VALIDATOR_EQUAL,
  VALIDATOR_PASSWORD,
  VALIDATOR_REQUIRE,
} from 'util/validators';
import './EditPassword.scss';

interface EditPasswordProps {
  onSuccess: () => void;
}

const EditPassword: React.FC<EditPasswordProps> = ({ onSuccess }) => {
  const { loading } = useAppSelector((state) => state.user);
  const { dispatch } = useAppDispatch();

  const { formState, setFormInput } = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const submitHandler = async () => {
    if (!formState.isValid) return;

    await dispatch(
      updateUserPassword({
        currentPassword: formState.inputs.currentPassword.value,
        newPassword: formState.inputs.newPassword.value,
        confirmPassword: formState.inputs.confirmPassword.value,
      })
    );

    onSuccess();
  };

  return (
    <Form onSubmit={submitHandler}>
      <Input
        id="currentPassword"
        type="password"
        formInput
        label="Current Password *"
        validators={[VALIDATOR_REQUIRE()]}
        onForm={setFormInput}
      />
      <Input
        id="newPassword"
        type="password"
        formInput
        label="New Password *"
        message="At least 8 characters with lowercase, uppercase, number, and special character"
        validators={[VALIDATOR_PASSWORD()]}
        onForm={setFormInput}
      />
      <Input
        id="confirmPassword"
        type="password"
        formInput
        label="Confirm Password *"
        validators={[VALIDATOR_EQUAL(formState.inputs.newPassword.value)]}
        onForm={setFormInput}
      />
      <Button loading={loading}>Change Password</Button>
    </Form>
  );
};

export default EditPassword;
