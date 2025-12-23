import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  totalPrice: number;
  onSuccess: (details: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ totalPrice, onSuccess }) => {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          if (!actions || !actions.order) {
            return Promise.reject(new Error('Order creation failed.'));
          }
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: "USD",
                value: totalPrice.toString(),
              },
            }],
            intent: 'CAPTURE'
          });
        }}
        onApprove={(data, actions) => {
          if (!actions || !actions.order) {
            return Promise.reject(new Error('Order approval failed.'));
          }
          return actions.order.capture().then((details) => {
            onSuccess(details);
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;