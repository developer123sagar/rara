import { Spinner } from "@/common";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent } from "react";
import toast from "react-hot-toast";

const CARD_OPTIONS = {
  style: {
    base: {
      color: "#333",
      fontWeight: 500,
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: {
      iconColor: "#ff4f4f",
      color: "#ff4f4f",
    },
  },
};

export default function PaymentForm({
  onHandleSubmit,
  label = "Pay",
  lodingStripePayment,
  setLoadingStripePayment,
}: {
  onHandleSubmit: (token?: string) => void;
  label?: string;
  lodingStripePayment: boolean;
  setLoadingStripePayment: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingStripePayment(true);

    const cardElement = elements && elements.getElement(CardElement);

    if (cardElement && stripe) {
      const { token, error } = await stripe.createToken(cardElement);

      if (!error) {
        if (typeof onHandleSubmit === "function") onHandleSubmit(token.id);
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }

    setLoadingStripePayment(false);
  };

  return (
    <div className="w-full mx-auto mt-8">
      <form className="max-w-md bg-white rounded">
        <div className="mb-6">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Card Details
          </label>
          <div className="border p-3 rounded">
            <CardElement options={CARD_OPTIONS} className="w-full" />
          </div>
        </div>
        <button
          className="bg-blue-500 text-white w-full p-3 flex items-center justify-center rounded hover:bg-blue-700"
          disabled={lodingStripePayment}
          onClick={handleSubmit}
        >
          {lodingStripePayment ? <Spinner btn /> : label}
        </button>
      </form>
    </div>
  );
}
