'use client';

import { useState, useCallback } from 'react';

interface PaymentOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onError?: (error: string) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(async (options: PaymentOptions) => {
    setLoading(true);
    setError(null);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order on server
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: options.amount,
          provider: 'razorpay',
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const order = await orderResponse.json();

      // Open Razorpay checkout
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: options.currency || 'INR',
        name: 'Workngin',
        description: options.description,
        order_id: order.orderId,
        handler: function (response: RazorpayResponse) {
          setLoading(false);
          options.onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#1e293b',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.on('payment.failed', function (response: any) {
        setLoading(false);
        const errorMessage = response.error?.description || 'Payment failed';
        setError(errorMessage);
        options.onError?.(errorMessage);
      });

      razorpay.open();
    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
    }
  }, [loadRazorpayScript]);

  return {
    initiatePayment,
    loading,
    error,
    clearError: () => setError(null),
  };
}
