import UserLayout from 'components/User/Layout/UserLayout';
import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { useForm } from 'hooks/form-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { sendRecovery } from 'store/thunks/user-thunk';
import { VALIDATOR_EMAIL } from 'util/validators';

const SendRecoveryPage: React.FC = () => {
  const { loading, error, message } = useAppSelector((state) => state.user);
  const { dispatch } = useAppDispatch();

  const { formState, setFormInput } = useForm({
    email: { value: '', isValid: false },
  });

  const submitHandler = (): void => {
    if (!formState.isValid) return;

    dispatch(sendRecovery(formState.inputs.email.value));
  };

  return (
    <UserLayout>
      <Response type={error ? 'error' : 'message'} content={error || message} />
      {!message && (
        <Form onSubmit={submitHandler}>
          <Input
            id="email"
            formInput
            autoFocus
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Button loading={loading}>SEND RECOVERY EMAIL</Button>
        </Form>
      )}
    </UserLayout>
  );
};

export default SendRecoveryPage;
