import { useDispatch, useSelector } from 'react-redux';

import AuthLayout from 'components/Auth/AuthLayout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { useForm } from 'hooks/use-form';
import { VALIDATOR_EMAIL } from 'util/validators';
import { sendRecoveryEmail } from 'store/actions/auth';

const SendRecoveryEmailPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const { formState, setFormInput } = useForm({
    email: { value: '', isValid: false },
  });

  const submitHandler = () => {
    if (!formState.isValid) return;

    dispatch(sendRecoveryEmail(formState.inputs.email.value));
  };

  return (
    <AuthLayout>
      <Response type={error ? 'error' : 'message'} content={error || message} />
      {!message && (
        <Form onSubmit={submitHandler}>
          <Input
            id="email"
            formElement
            autoFocus
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Button loading={loading}>SEND RECOVERY EMAIL</Button>
        </Form>
      )}
    </AuthLayout>
  );
};

export default SendRecoveryEmailPage;
