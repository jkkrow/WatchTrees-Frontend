import { useState } from 'react';

import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import FormModal from 'components/Layout/Modal/Form/FormModal';
import GoBack from 'components/Common/UI/GoBack/GoBack';
import { useForm } from 'hooks/common/form';
import { useAppThunk } from 'hooks/common/store';
import { UserPremium } from 'store/slices/user-slice';
import { cancelSubscription } from 'store/thunks/payment-thunk';
import './UserPremiumDashboard.scss';

interface UserPremiumDashboardProps {
  premium: UserPremium;
}

const UserPremiumDashboard: React.FC<UserPremiumDashboardProps> = ({
  premium,
}) => {
  const [displayModal, setDisplayModal] = useState(false);
  const { dispatchThunk, loading } = useAppThunk();
  const { formState, setFormInput } = useForm({
    reason: { value: '', isValid: true },
  });

  const requestCancelHandler = () => {
    setDisplayModal(true);
  };

  const undoCancelHandler = () => {
    setDisplayModal(false);
  };

  const confirmCancelHandler = async () => {
    await dispatchThunk(
      cancelSubscription(premium.id, formState.inputs.reason.value)
    );
  };

  return (
    <div className="user-premium-dashboard">
      <FormModal
        on={displayModal}
        header="Cancel Premium Membership"
        content={
          <Input
            id="reason"
            placeholder="Please tell us the reason (optional)"
            formInput
            onForm={setFormInput}
          />
        }
        footer="Continue"
        loading={loading}
        onConfirm={confirmCancelHandler}
        onClose={undoCancelHandler}
      />
      <GoBack to="/user/account" />

      <h2>Premium Membership</h2>
      <div data-label="Name">{premium.name}</div>
      <div
        data-label={
          premium.isCancelled ? 'Expiration Date' : 'Next Billing Date'
        }
      >
        {new Date(premium.expiredAt).toLocaleDateString('en-US', {
          timeZone: 'UTC',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>

      <Button disabled={premium.isCancelled} onClick={requestCancelHandler}>
        {premium.isCancelled
          ? 'The membership will be cancelled at expiration date'
          : 'Cancel Membership'}
      </Button>
    </div>
  );
};

export default UserPremiumDashboard;
