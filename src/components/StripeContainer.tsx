import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { stripe_pk } from "@/routes";

const stripeTestPromise = loadStripe(stripe_pk);

export default function StripeContainer({
  handleSubmit,
  label,
  lodingStripePayment,
  setLoadingStripePayment,
}: {
  handleSubmit: (token?: string) => void;
  label?: string;
  lodingStripePayment: boolean;
  setLoadingStripePayment: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm
        onHandleSubmit={handleSubmit}
        label={label}
        lodingStripePayment={lodingStripePayment}
        setLoadingStripePayment={setLoadingStripePayment}
      />
    </Elements>
  );
}
